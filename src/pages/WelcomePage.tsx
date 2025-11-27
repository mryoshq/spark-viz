import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Database, Layers, ArrowRight, Sparkles } from 'lucide-react';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    const visualizers = [
        {
            id: 'core-internals',
            title: 'Spark Core Internals',
            description: 'Explore how Spark partitions data, distributes tasks to workers, and manages memory versus disk storage spillover.',
            icon: Zap,
            gradient: 'from-orange-500 to-red-600',
            path: '/core-internals'
        },
        {
            id: 'internals',
            title: 'Spark Execution Flow',
            description: 'Visualize Spark\'s internal architecture and step-by-step execution flow through the cluster.',
            icon: Database,
            gradient: 'from-blue-500 to-purple-600',
            path: '/internals'
        },
        {
            id: 'lakehouse',
            title: 'Spark Lakehouse Architecture',
            description: 'Understand Spark\'s role as a compute engine within a modern Data Lakehouse architecture.',
            icon: Layers,
            gradient: 'from-cyan-500 to-blue-600',
            path: '/lakehouse'
        },
        {
            id: 'advanced',
            title: 'Advanced Concepts',
            description: 'Deep dive into shuffle, DAG execution, lazy evaluation, Catalyst optimizer, fault tolerance, and more.',
            icon: Sparkles,
            gradient: 'from-purple-500 to-pink-600',
            path: '/advanced'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.15)',
                    filter: 'blur(100px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    background: 'rgba(168, 85, 247, 0.15)',
                    filter: 'blur(100px)'
                }} />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 py-8" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-lg" style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                        color: 'white',
                        boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.39)'
                    }}>
                        S
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'white' }}>
                        Spark Visualizers
                    </h1>
                </div>
                <p className="text-xl" style={{ color: 'rgba(148, 163, 184, 1)', marginLeft: '2.75rem' }}>
                    Interactive animations for visual learners
                </p>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 px-6 pb-12" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                {/* Hero Section */}
                <div className="text-center mb-12 mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: 'rgba(147, 197, 253, 1)'
                    }}>
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">Learn Apache Spark Visually</span>
                    </div>
                    <h2 className="text-5xl font-bold mb-4" style={{ color: 'white' }}>
                        Understand Spark Internals
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(148, 163, 184, 1)' }}>
                        Master the inner workings of Apache Spark through interactive, animated visualizations
                        designed specifically for visual learners.
                    </p>
                </div>

                {/* Visualizer Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginTop: '3rem'
                }}>
                    {visualizers.map((viz) => {
                        const Icon = viz.icon;
                        return (
                            <div
                                key={viz.id}
                                onClick={() => navigate(viz.path)}
                                className="cursor-pointer transition-all duration-300 rounded-2xl p-6"
                                style={{
                                    background: 'rgba(30, 41, 59, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(71, 85, 105, 0.5)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.5)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                }}
                            >
                                {/* Icon */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                                        background: `linear-gradient(135deg, ${viz.gradient.split(' ')[0].replace('from-', '#')} 0%, ${viz.gradient.split(' ')[1].replace('to-', '#')} 100%)`,
                                        boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.25)'
                                    }}>
                                        <Icon size={24} style={{ color: 'white' }} />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold mb-2" style={{ color: 'white' }}>
                                    {viz.title}
                                </h3>
                                <p className="text-sm mb-6" style={{ color: 'rgba(148, 163, 184, 1)', lineHeight: '1.625' }}>
                                    {viz.description}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center gap-2 text-sm font-medium" style={{
                                    color: 'rgba(147, 197, 253, 1)'
                                }}>
                                    <span>Explore visualization</span>
                                    <ArrowRight size={16} className="transition-all" style={{ transform: 'translateX(0)' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-16 text-center">
                    <div className="inline-block rounded-xl p-6 max-w-2xl" style={{
                        background: 'rgba(17, 24, 39, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(55, 65, 81, 0.5)'
                    }}>
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles size={20} style={{ color: 'rgba(251, 191, 36, 1)' }} />
                            <h3 className="text-lg font-semibold" style={{ color: 'white' }}>About These Visualizations</h3>
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(156, 163, 175, 1)', lineHeight: '1.625' }}>
                            These interactive animations are designed to help visual learners understand complex Apache Spark concepts.
                            Each visualization demonstrates different aspects of Spark's architecture and execution model in an intuitive,
                            hands-on way. Click any card above to start exploring!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WelcomePage;
