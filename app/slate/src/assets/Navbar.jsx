import React from 'react';
import { Sparkles, RefreshCw, Command, User } from 'lucide-react';

export default function Navbar({ onGenerate, loading, employeeCount, shiftCount }) {
    return (
        <header style={{
            height: '64px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(8, 9, 12, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30
        }}>
            {/* Quick Search Placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', width: '260px' }}>
                <Command size={14} />
                <span>Search constraints or shifts...</span>
            </div>

            {/* Action Center */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={onGenerate}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 0 16px rgba(99, 102, 241, 0.3)',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? (
                        <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                        <Sparkles size={14} />
                    )}
                    <span>{loading ? 'Solving Constraints...' : 'Auto-Generate Schedule'}</span>
                </button>

                <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        <User size={16} />
                    </div>
                </div>
            </div>
        </header>
    );
}