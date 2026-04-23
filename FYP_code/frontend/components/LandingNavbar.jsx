import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';

const LandingNavbar = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            setIsScrolled(latest > 40);
        });
        return () => unsubscribe();
    }, [scrollY]);

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    const hl = { fontFamily: 'var(--font-headline)' };
    const bd = { fontFamily: 'var(--font-body)' };

    return (
        <motion.div
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="navbar"
        >
            <motion.div
                className="nav-inner"
                animate={{
                    boxShadow: isScrolled
                        ? '0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.18)'
                        : '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                    borderColor: isScrolled
                        ? 'rgba(124,58,237,0.30)'
                        : 'rgba(139,92,246,0.18)',
                }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="logo-box">
                        <span style={hl}>FL</span>
                    </div>
                    <span
                        className="text-lg hidden sm:block"
                        style={{ ...hl, color: 'white', fontWeight: 700, letterSpacing: '-0.3px' }}
                    >
                        FormLens
                    </span>
                </Link>

                {/* Desktop Links */}
                <nav className="nav-links hidden md:flex">
                    {navItems.map((item, i) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            className="nav-link relative"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ color: '#ffffff', y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.label}
                        </motion.a>
                    ))}
                </nav>

                {/* Right CTA */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="hidden sm:flex items-center gap-2 btn-primary"
                        style={{ padding: '9px 18px', fontSize: '13px', borderRadius: '12px' }}
                    >
                        <span>Get Started</span>
                        <ArrowRight size={14} />
                    </Link>

                    {/* Mobile burger */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="mobile-menu md:hidden"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
                                style={{ color: 'var(--text-muted)', ...bd }}
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="h-px bg-white/5 my-2" />
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="btn-primary block text-center mt-1"
                            style={{ padding: '10px', borderRadius: '12px', fontSize: '13px' }}
                        >
                            Get Started Free
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LandingNavbar;
