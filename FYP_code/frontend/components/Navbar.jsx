import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
    GraduationCap,
    ShieldCheck,
    LogIn,
    LogOut,
    UserPlus,
    CircleUser,
    Workflow,
    ScanLine,
    Menu,
    X
} from 'lucide-react';

import { api } from '../src/index';

const Navbar = ({ role, setRole }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/logout/', {}, { withCredentials: true });
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem('auth_token');
        setRole(null);
        navigate('/');
    };

    const navItems = [
        { name: 'Profile',              path: '/profile',             icon: CircleUser,   roles: ['admin', 'student'] },
        { name: 'Student',              path: '/student',             icon: GraduationCap, roles: ['student'] },
        { name: 'Admin',                path: '/admin',               icon: ShieldCheck,  roles: ['admin'] },
        { name: 'Detection',            path: '/detection',           icon: ScanLine,     roles: ['admin'] },
        { name: 'Registration',         path: '/admin/registration',  icon: UserPlus,     roles: ['admin'] },
        { name: 'Workflow Management',  path: '/admin/workflow',      icon: Workflow,     roles: ['admin'] },
    ];

    const visibleItems = role ? navItems.filter((item) => item.roles.includes(role)) : [];

    /* ── shared style tokens ───────────────────────────────── */
    const sidebarStyle = {
        background: 'rgba(13, 11, 24, 0.92)',
        border: '1px solid rgba(139, 92, 246, 0.14)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
    };

    const activeItemStyle = {
        background: 'linear-gradient(135deg, rgba(34,197,94,0.35), rgba(99,102,241,0.25))',
        color: '#e9d5ff',
        boxShadow: '0 0 0 1px rgba(34,197,94,0.30)',
    };

    const idleItemStyle = { color: 'var(--text-muted)' };

    const headlineFont = { fontFamily: 'var(--font-headline)' };

    return (
        <>
            {/* ── Desktop Sidebar ────────────────────────────────── */}
            <div className="fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] hidden md:flex flex-col justify-center">
                <motion.nav
                    initial={{ width: 248 }}
                    animate={{ width: isExpanded ? 248 : 86 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className="rounded-2xl py-4 px-3 no-scrollbar"
                    style={{ ...sidebarStyle, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                >
                    {/* Brand row */}
                    <div className="flex items-center justify-between px-2 mb-3">
                        <Link to="/" className="flex items-center gap-2 min-w-0">
                            <div
                                className="p-1.5 rounded-lg text-white"
                                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                            >
                                <GraduationCap size={16} />
                            </div>
                            {isExpanded && (
                                <span
                                    className="text-xl"
                                    style={{ ...headlineFont, color: 'var(--page-text)', fontWeight: 700 }}
                                >
                                    FormLens
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold transition-colors"
                            style={{ color: 'var(--text-muted)', ...headlineFont }}
                        >
                            {isExpanded ? 'Min' : 'Max'}
                        </button>
                    </div>

                    <ul className="flex flex-col gap-1.5">
                        {visibleItems.map((item, i) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-3 rounded-xl px-3 py-3 relative overflow-hidden group"
                                        style={isActive ? activeItemStyle : idleItemStyle}
                                        title={!isExpanded ? item.name : undefined}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNavIndicator"
                                                className="absolute inset-0 rounded-xl"
                                                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.20), rgba(99,102,241,0.15))' }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <motion.div
                                            whileHover={{ rotate: 8, scale: 1.15 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="relative z-10"
                                        >
                                            <Icon size={20} />
                                        </motion.div>
                                        {isExpanded && (
                                            <span className="text-sm font-semibold relative z-10" style={headlineFont}>
                                                {item.name}
                                            </span>
                                        )}
                                        {!isExpanded && (
                                            <span className="tooltip">{item.name}</span>
                                        )}
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </ul>

                    <div
                        className="mt-4 pt-3"
                        style={{ borderTop: '1px solid rgba(34,197,94,0.10)' }}
                    >
                        {!role ? (
                            <Link
                                to="/login"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
                                style={idleItemStyle}
                            >
                                <LogIn size={20} />
                                {isExpanded && (
                                    <span className="text-sm font-semibold" style={headlineFont}>
                                        Sign In
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
                                style={{ color: '#f87171' }}
                            >
                                <LogOut size={20} />
                                {isExpanded && (
                                    <span className="text-sm font-semibold" style={headlineFont}>
                                        Logout
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </motion.nav>
            </div>

            {/* ── Mobile top bar ──────────────────────────────────── */}
            <div className="fixed top-3 inset-x-3 z-50 md:hidden">
                <div
                    className="rounded-2xl px-4 py-3 shadow-lg"
                    style={sidebarStyle}
                >
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2">
                            <div
                                className="p-1.5 rounded-lg text-white"
                                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                            >
                                <GraduationCap size={16} />
                            </div>
                            <span
                                className="text-xl"
                                style={{ ...headlineFont, color: 'var(--page-text)', fontWeight: 700 }}
                            >
                                FormLens
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="rounded-lg p-2 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile drawer ───────────────────────────────────── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 z-40 md:hidden"
                            aria-label="Close mobile menu backdrop"
                        />
                        <motion.nav
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="fixed top-20 left-3 right-3 z-50 md:hidden rounded-2xl p-3 shadow-xl"
                            style={sidebarStyle}
                        >
                            <ul className="flex flex-col gap-1.5">
                                {visibleItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors"
                                                style={isActive ? activeItemStyle : idleItemStyle}
                                            >
                                                <Icon size={18} />
                                                <span style={headlineFont}>{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div
                                className="mt-2 pt-2"
                                style={{ borderTop: '1px solid rgba(34,197,94,0.10)' }}
                            >
                                {!role ? (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors"
                                        style={idleItemStyle}
                                    >
                                        <LogIn size={18} />
                                        <span style={headlineFont}>Sign In</span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                        className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors"
                                        style={{ color: '#f87171' }}
                                    >
                                        <LogOut size={18} />
                                        <span style={headlineFont}>Logout</span>
                                    </button>
                                )}
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
