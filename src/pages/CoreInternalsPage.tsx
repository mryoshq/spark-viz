import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CONFIG, COLORS } from '../constants/coreInternalsConstants';
import { WorkerNode, Partition, PartitionState, SimulationConfig, LogEntry } from '../types/coreInternalsTypes';
import { WorkerNodeViz } from '../components/core-internals/WorkerNodeViz';
import { PartitionBlock } from '../components/core-internals/PartitionBlock';
import { Play, Pause, RotateCcw, Database, Server, Settings, Info, Home } from 'lucide-react';

// Helper to create initial partitions
const createPartitions = (totalMB: number, partSizeMB: number): Partition[] => {
  const count = Math.ceil(totalMB / partSizeMB);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    sizeMB: partSizeMB,
    state: PartitionState.PENDING,
    workerId: null,
    progress: 0,
  }));
};

// Helper to create workers
const createWorkers = (count: number, ramMB: number, cores: number): WorkerNode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Executor ${i + 1}`,
    cores,
    activeTasks: 0,
    ramTotalMB: ramMB,
    ramUsedMB: 0,
    diskUsedMB: 0,
    partitionsInRam: [],
    partitionsInDisk: [],
  }));
};

export default function CoreInternalsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [workers, setWorkers] = useState<WorkerNode[]>([]);
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Refs for simulation loop to avoid dependency staleness
  const stateRef = useRef({ workers, partitions, isRunning, config });

  // Keep refs synced
  useEffect(() => {
    stateRef.current = { workers, partitions, isRunning, config };
  }, [workers, partitions, isRunning, config]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' }),
      message,
      type
    }, ...prev].slice(50));
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setWorkers(createWorkers(config.workerCount, config.workerRamMB, config.workerCores));
    setPartitions(createPartitions(config.totalDataMB, config.partitionSizeMB));
    setLogs([]);
    addLog('Simulation reset. Ready to submit job.', 'info');
  }, [config, addLog]);

  // Initialize on mount
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The Core Logic Tick
  const tick = useCallback(() => {
    const { workers: currentWorkers, partitions: currentPartitions, config: currentConfig } = stateRef.current;

    let nextWorkers = [...currentWorkers];
    let nextPartitions = [...currentPartitions];
    let hasChanges = false;

    // 1. Assign Pending Partitions to Free Slots
    const pendingPartitions = nextPartitions.filter(p => p.state === PartitionState.PENDING);

    pendingPartitions.forEach(part => {
      // Find a worker with free slots (simple Round Robin or Least Loaded)
      // Strategy: Least Active Tasks
      const sortedWorkers = [...nextWorkers].sort((a, b) => a.activeTasks - b.activeTasks);
      const candidate = sortedWorkers.find(w => w.activeTasks < w.cores);

      if (candidate) {
        // Assign
        const wIndex = nextWorkers.findIndex(w => w.id === candidate.id);
        nextWorkers[wIndex] = {
          ...candidate,
          activeTasks: candidate.activeTasks + 1
        };

        const pIndex = nextPartitions.findIndex(p => p.id === part.id);
        nextPartitions[pIndex] = {
          ...part,
          state: PartitionState.PROCESSING,
          workerId: candidate.id,
          progress: 0
        };

        addLog(`Driver assigned Partition #${part.id} to ${candidate.name}`, 'info');
        hasChanges = true;
      }
    });

    // 2. Process Running Partitions
    const processingPartitions = nextPartitions.filter(p => p.state === PartitionState.PROCESSING);

    processingPartitions.forEach(part => {
      const pIndex = nextPartitions.findIndex(p => p.id === part.id);
      const wIndex = nextWorkers.findIndex(w => w.id === part.workerId);

      // Increment progress based on speed
      // speedMs is the interval duration. 
      // To make it smoother, we increment small amounts.
      const progressStep = 5;
      const newProgress = part.progress + progressStep;

      if (newProgress >= 100) {
        // Task Completed
        // LOGIC: Storage Decision (Simulate Result Caching)
        const worker = nextWorkers[wIndex];
        const partSize = part.sizeMB;
        let newState = PartitionState.COMPLETED; // Default if we don't cache, but let's assume we CACHE results for this demo

        // Try RAM
        if (worker.ramUsedMB + partSize <= worker.ramTotalMB) {
          newState = PartitionState.CACHED_RAM;
          nextWorkers[wIndex] = {
            ...worker,
            activeTasks: worker.activeTasks - 1,
            ramUsedMB: worker.ramUsedMB + partSize,
            partitionsInRam: [...worker.partitionsInRam, part.id]
          };
          addLog(`Partition #${part.id} processed & cached in ${worker.name} Memory (RAM).`, 'success');
        } else {
          // Spill to Disk
          newState = PartitionState.CACHED_DISK;
          nextWorkers[wIndex] = {
            ...worker,
            activeTasks: worker.activeTasks - 1,
            diskUsedMB: worker.diskUsedMB + partSize,
            partitionsInDisk: [...worker.partitionsInDisk, part.id]
          };
          addLog(`Memory Full on ${worker.name}! Partition #${part.id} spilled to Local Disk.`, 'warning');
        }

        nextPartitions[pIndex] = {
          ...part,
          state: newState,
          progress: 100
        };
        hasChanges = true;
      } else {
        // Just update progress
        nextPartitions[pIndex] = {
          ...part,
          progress: newProgress
        };
        hasChanges = true;
      }
    });

    // Check if all done
    const allDone = nextPartitions.every(p =>
      p.state === PartitionState.CACHED_RAM ||
      p.state === PartitionState.CACHED_DISK ||
      p.state === PartitionState.COMPLETED
    );

    if (allDone && stateRef.current.isRunning) {
      setIsRunning(false);
      setIsFinished(true);
      addLog("Job Completed Successfully.", 'success');
    }

    if (hasChanges) {
      setWorkers(nextWorkers);
      setPartitions(nextPartitions);
    }
  }, [addLog]);

  // Run Loop
  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      // The interval is the speedMs config
      intervalId = window.setInterval(tick, config.speedMs);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, config.speedMs, tick]);


  // UI Handlers
  const handleUpdateConfig = (key: keyof SimulationConfig, val: number) => {
    setConfig(prev => ({ ...prev, [key]: val }));
    if (['totalDataMB', 'partitionSizeMB', 'workerCount', 'workerRamMB', 'workerCores'].includes(key)) {
      // Stop if structural changes
      setIsRunning(false);
      // Optionally reset automatically:
      // resetSimulation(); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">S</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 leading-none">Spark Internals <span className="font-light text-slate-400">Visualizer</span></h1>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Partitioning • Caching • Spillover</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 border border-slate-700"
          >
            <Home size={18} /> Home
          </button>
          <button
            onClick={() => { if (isFinished || (!isRunning && partitions.some(p => p.state !== PartitionState.PENDING))) resetSimulation(); setIsRunning(!isRunning); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${isRunning ? 'bg-amber-600 text-white hover:bg-amber-500 border border-amber-500' : 'bg-orange-600 text-white hover:bg-orange-500 border border-orange-500'}`}
          >
            {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {isFinished ? 'Restart' : 'Start Job'}</>}
          </button>
          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 border border-slate-700"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Config */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto p-6 flex flex-col gap-8 shadow-[4px_0_24px_rgba(0,0,0,0.3)] z-0">

          {/* Legend */}
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Legend</h3>
            <div className="space-y-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${COLORS.partitionPending}`}></div>
                <span>Pending Partition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${COLORS.partitionProcessing} animate-pulse`}></div>
                <span>Processing (Active)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${COLORS.partitionRam}`}></div>
                <span>Cached in RAM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${COLORS.partitionDisk}`}></div>
                <span>Spilled to Local Disk</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Settings size={14} /> Simulation Control
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5 flex justify-between">
                  <span>Simulation Speed</span>
                  <span className="text-slate-400 font-normal">{config.speedMs}ms / tick</span>
                </label>
                <input type="range" min="50" max="1500" step="50"
                  value={config.speedMs}
                  onChange={(e) => handleUpdateConfig('speedMs', parseInt(e.target.value))}
                  className="w-full accent-slate-900 mb-1"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Fast</span>
                  <span>Slow</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server size={14} /> Cluster Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Total Data (MB)</label>
                <input type="range" min="100" max="1000" step="50"
                  value={config.totalDataMB}
                  onChange={(e) => handleUpdateConfig('totalDataMB', parseInt(e.target.value))}
                  className="w-full accent-slate-500 mb-1"
                  disabled={isRunning}
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>100MB</span>
                  <span className="text-orange-400 font-bold">{config.totalDataMB} MB</span>
                  <span>1GB</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Partition Size (MB)</label>
                <select
                  value={config.partitionSizeMB}
                  onChange={(e) => handleUpdateConfig('partitionSizeMB', parseInt(e.target.value))}
                  className="w-full p-2 border border-slate-700 rounded bg-slate-800 text-slate-100 text-sm disabled:opacity-50"
                  disabled={isRunning}
                >
                  <option value="10">10 MB (Granular)</option>
                  <option value="20">20 MB (Standard)</option>
                  <option value="50">50 MB (Large chunks)</option>
                </select>
              </div>
              <div className="pt-2 border-t border-slate-700 mt-2">
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Worker Memory (RAM)</label>
                <input type="range" min="40" max="200" step="20"
                  value={config.workerRamMB}
                  onChange={(e) => handleUpdateConfig('workerRamMB', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 mb-1"
                  disabled={isRunning}
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>40MB</span>
                  <span className="text-emerald-600 font-bold">{config.workerRamMB} MB</span>
                  <span>200MB</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Worker Count</label>
                <input type="range" min="1" max="5" step="1"
                  value={config.workerCount}
                  onChange={(e) => handleUpdateConfig('workerCount', parseInt(e.target.value))}
                  className="w-full accent-blue-500 mb-1"
                  disabled={isRunning}
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>1</span>
                  <span className="text-blue-400 font-bold">{config.workerCount} Workers</span>
                  <span>5</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Cores per Worker</label>
                <input type="range" min="1" max="4" step="1"
                  value={config.workerCores}
                  onChange={(e) => handleUpdateConfig('workerCores', parseInt(e.target.value))}
                  className="w-full accent-purple-500 mb-1"
                  disabled={isRunning}
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>1</span>
                  <span className="text-purple-400 font-bold">{config.workerCores} Cores</span>
                  <span>4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-700">
            <div className="bg-blue-900/30 p-3 rounded border border-blue-800 text-xs text-blue-300 space-y-2">
              <div className="flex gap-2 items-center">
                <Info size={16} className="shrink-0 mt-0.5" />
                <span className="font-semibold">About This Demo</span>
              </div>
              <p>This simulation visualizes how Apache Spark distributes data and manages memory. Watch how partitions are assigned to executor workers and cached based on available RAM.</p>
            </div>
          </div>

        </aside>

        {/* Center: Visualization */}
        <div className="flex-1 bg-slate-950/50 flex flex-col relative">
          {/* Cluster Map */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* DRIVER NODE */}
              <div className="flex flex-col items-center">
                <div className={`w-64 ${COLORS.driver} text-white rounded-xl shadow-lg p-4 relative z-10`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold flex items-center gap-2"><Server size={16} /> Driver Node</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Cluster Manager</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded text-xs font-mono mb-2">
                    <div>Pending Tasks: {partitions.filter(p => p.state === PartitionState.PENDING).length}</div>
                    <div>Active Tasks: {partitions.filter(p => p.state === PartitionState.PROCESSING).length}</div>
                  </div>
                  <div className="text-[10px] opacity-80 text-center">
                    Orchestrates task scheduling & monitoring
                  </div>
                </div>
                {/* Connector Line */}
                <div className="h-12 w-0.5 bg-slate-700"></div>
              </div>

              {/* WORKERS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map(worker => (
                  <WorkerNodeViz key={worker.id} worker={worker} partitions={partitions} />
                ))}
              </div>

              {/* DATA SOURCE */}
              <div className="flex flex-col items-center pt-4">
                <div className="h-12 w-0.5 bg-slate-700 mb-2"></div>
                <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-slate-200 font-bold">
                    <Database size={18} />
                    <span>Distributed Storage (HDFS / S3)</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Partitions ({partitions.length})</h3>
                  <div className="flex flex-wrap gap-1 justify-center w-full">
                    {partitions.map(p => (
                      <PartitionBlock key={p.id} partition={p} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Logs */}
          <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
              <span>Execution Logs</span>
              <span className="font-mono">{logs.length} events</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5">
              {logs.length === 0 && <div className="text-slate-500 italic">Waiting to start...</div>}
              {logs.map(log => (
                <div key={log.id} className={`flex gap-3 ${log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-amber-400' :
                    log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
