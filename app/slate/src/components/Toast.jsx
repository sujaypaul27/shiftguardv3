import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Toast({ message }) {
    if (!message || !message.text) return null;

    const isError = message.type === 'error';
    const isSuccess = message.type === 'success';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    background: isError ? 'rgba(244, 63, 94, 0.15)' : isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    border: `1px solid ${isError ? 'var(--accent-rose)' : isSuccess ? 'var(--accent-emerald)' : 'var(--accent-primary)'}`,
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                }}
            >
                {isError ? <AlertCircle size={18} color="var(--accent-rose)" /> : isSuccess ? <CheckCircle2 size={18} color="var(--accent-emerald)" /> : <Info size={18} color="var(--accent-primary)" />}

                <div>
                    {message.rule && (
                        <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '2px 6px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', marginRight: '8px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              {message.rule}
            </span>
                    )}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{message.text}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}