import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, CheckCircle2 } from 'lucide-react';

const BEZIER = [0.22, 1, 0.36, 1];
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeInUp = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: BEZIER } },
};

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <footer className="relative mt-20 py-16 border-t" style={{ borderTopColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
                >
                    {/* Brand */}
                    <motion.div variants={fadeInUp} className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <motion.div
                                className="p-2 rounded-lg text-white"
                                style={{ backgroundColor: '#10b981' }}
                                whileHover={{ rotate: 10, scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                            >
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>A</span>
                            </motion.div>
                            <span className="text-2xl font-bold tracking-tight text-white">Automate</span>
                        </Link>
                        <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                            Intelligent automation solutions for modern businesses.
                        </p>
                    </motion.div>

                    {/* Product */}
                    <motion.div variants={fadeInUp}>
                        <h4 className="mb-6 uppercase tracking-wider text-xs font-bold text-white">Product</h4>
                        <ul className="space-y-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                            {['Features', 'Pricing', 'Security', 'Roadmap'].map((l, i) => (
                                <motion.li key={l} whileHover={{ x: 4, color: '#10b981', transition: { type: 'spring', stiffness: 300, damping: 20 } }}>
                                    <a href="#" className="transition-colors">{l}</a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company */}
                    <motion.div variants={fadeInUp}>
                        <h4 className="mb-6 uppercase tracking-wider text-xs font-bold text-white">Company</h4>
                        <ul className="space-y-4 text-sm font-medium" style={{ color: '#6b7280' }}>
                            {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
                                <motion.li key={l} whileHover={{ x: 4, color: '#10b981', transition: { type: 'spring', stiffness: 300, damping: 20 } }}>
                                    <a href="#" className="transition-colors">{l}</a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div variants={fadeInUp} className="card">
                        <h4 className="font-bold mb-4 text-white">Newsletter</h4>
                        <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                            Stay updated with our latest features
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#6b7280' }} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full rounded-lg py-3 pl-10 pr-4 text-sm outline-none transition-all"
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        color: '#ffffff'
                                    }}
                                />
                            </div>
                            <button
                                disabled={status !== 'idle'}
                                className="w-full btn-primary font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <AnimatePresence mode="wait">
                                    {status === 'idle' && (
                                        <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            Subscribe <Send size={16} />
                                        </motion.span>
                                    )}
                                    {status === 'sending' && (
                                        <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            Sending...
                                        </motion.span>
                                    )}
                                    {status === 'success' && (
                                        <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            Sent! <CheckCircle2 size={16} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </form>
                    </motion.div>
                </motion.div>

                {/* Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: BEZIER, delay: 0.3 }}
                    className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6"
                    style={{ borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}
                >
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                        © 2026 Automate. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm font-medium" style={{ color: '#6b7280' }}>
                        {['Privacy', 'Terms', 'Contact'].map((l) => (
                            <motion.a
                                key={l}
                                href="#"
                                whileHover={{ color: '#10b981', y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                            >
                                {l}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
