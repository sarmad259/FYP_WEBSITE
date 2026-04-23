import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Lock, ArrowLeft, Scan, AlertCircle, Hexagon } from 'lucide-react';
import { api, useAlert } from '../src/index';

const SPRING = { type: 'spring', stiffness: 120, damping: 20 };
const BEZIER = [0.22, 1, 0.36, 1];

const fieldVariants = {
    hidden: { opacity: 0, x: 30, filter: 'blur(8px)' },
    visible: (i) => ({
        opacity: 1, x: 0, filter: 'blur(0px)',
        transition: { delay: i * 0.1, duration: 0.6, ease: BEZIER }
    }),
};

const Login = ({ setRole }) => {
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post(
                `/login/`,
                { username: formData.username, password: formData.password },
                { withCredentials: true }
            );
            const { role, force_password_change, access } = response.data;
            if (access) localStorage.setItem('auth_token', access);
            setRole(role);
            if (role === 'admin') navigate('/admin');
            else if (role === 'student') navigate('/student');
            else setError("You do not have access");
            if (force_password_change) {
                showAlert('You must change your password before continuing.', 'warning', 5000);
                navigate(`/${role}/change-password`);
                return;
            }
            showAlert("Login successful", "success", 2000);
        } catch (err) {
            if (err.response?.status === 401) {
                showAlert({ type: 'error', message: err.response.data.detail || "Invalid credentials" });
            } else {
                showAlert({ type: 'error', message: "Something went wrong!" });
            }
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hl = { fontFamily: 'var(--font-headline)' };
    const bd = { fontFamily: 'var(--font-body)' };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: 'var(--page-bg)' }}
        >
            {/* ── Helium Blob Background ───────────────────────────── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top-left violet */}
                <div
                    className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[130px] animate-blob"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.26) 0%, transparent 70%)' }}
                />
                {/* Bottom-right indigo */}
                <div
                    className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
                        animationDelay: '2s'
                    }}
                />
                {/* Centre purple accent */}
                <div
                    className="absolute top-[40%] left-[35%] w-[450px] h-[450px] rounded-full blur-[100px] animate-blob"
                    style={{
                        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                        animationDelay: '4s'
                    }}
                />
            </div>

            {/* ── Split Card ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] max-w-5xl mx-4 grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] shadow-2xl overflow-hidden"
                style={{
                    background: 'rgba(13,11,24,0.70)',
                    border: '1px solid rgba(139,92,246,0.18)',
                    backdropFilter: 'blur(28px)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.10)'
                }}
            >
                {/* ── Left Panel ─ Visual ─────────────────────────── */}
                <div
                    className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.20) 0%, rgba(99,102,241,0.12) 60%, rgba(13,11,24,0.95) 100%)' }}
                >
                    {/* Subtle glow behind logo */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[80px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)' }}
                    />

                    <ArrowLeft
                        className="absolute top-8 left-8 h-6 w-6 cursor-pointer transition-opacity hover:opacity-100 opacity-50"
                        style={{ color: 'var(--page-text)' }}
                        onClick={() => navigate('/')}
                    />

                    <div className="flex flex-col items-center text-center relative z-10">
                        {/* Logo composite */}
                        <div className="mb-8 relative group cursor-default">
                            <motion.div
                                className="absolute inset-0 blur-2xl rounded-full"
                                style={{ background: 'rgba(124,58,237,0.35)' }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <div className="relative flex items-center justify-center">
                                {/* Rotating outer ring */}
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Hexagon className="h-32 w-32" style={{ color: 'rgba(139,92,246,0.25)' }} strokeWidth={1} />
                                </motion.div>
                                {/* Static inner hexagon */}
                                <motion.div
                                    whileHover={{ rotate: 0, scale: 1.1, transition: SPRING }}
                                    initial={{ rotate: -12 }}
                                >
                                    <Hexagon
                                        className="h-32 w-32 relative z-10"
                                        style={{
                                            color: '#a78bfa',
                                            filter: 'drop-shadow(0 0 16px rgba(124,58,237,0.55))'
                                        }}
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                                {/* Central scan icon */}
                                <motion.div
                                    className="absolute z-20"
                                    whileHover={{ scale: 1.15, transition: SPRING }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Scan className="h-14 w-14 text-white drop-shadow-lg" strokeWidth={1.5} />
                                </motion.div>
                            </div>
                        </div>

                        <h1 className="text-5xl italic mb-3 tracking-tight" style={{ ...hl, color: 'var(--page-text)' }}>
                            FormLens
                        </h1>
                        <p className="text-lg font-medium" style={{ ...bd, color: 'rgba(196,181,253,0.65)' }}>
                            Intelligent Document Synthesis.
                        </p>
                    </div>
                </div>

                {/* ── Right Panel ─ Form ──────────────────────────── */}
                <div
                    className="relative p-6 sm:p-12 flex flex-col justify-center items-center overflow-hidden"
                    style={{ background: 'rgba(10,8,20,0.60)' }}
                >
                    {/* Soft accent blobs behind form */}
                    <div
                        className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full blur-[80px] pointer-events-none"
                        style={{ background: 'rgba(124,58,237,0.08)' }}
                    />
                    <div
                        className="absolute bottom-[-10%] left-[-10%] w-[280px] h-[280px] rounded-full blur-[70px] pointer-events-none"
                        style={{ background: 'rgba(99,102,241,0.07)' }}
                    />

                    {/* Mobile back */}
                    <div className="lg:hidden w-full mb-6">
                        <ArrowLeft
                            className="h-6 w-6 cursor-pointer hover:scale-110 transition"
                            style={{ color: 'var(--page-text)' }}
                            onClick={() => navigate('/')}
                        />
                    </div>

                    {/* Inner form card */}
                    <div
                        className="w-full max-w-sm rounded-[2rem] p-8 relative z-10"
                        style={{
                            background: 'rgba(18,14,35,0.80)',
                            border: '1px solid rgba(139,92,246,0.20)',
                            backdropFilter: 'blur(16px)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.40)'
                        }}
                    >
                        <motion.div
                            className="mb-8 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: BEZIER }}
                        >
                            <h3 className="text-2xl font-bold mb-2" style={{ ...hl, color: 'var(--page-text)' }}>
                                Welcome Back
                            </h3>
                            <p className="text-sm" style={{ ...bd, color: 'var(--text-muted)' }}>
                                Please enter your details
                            </p>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={SPRING}
                                    className="mb-6 p-3 rounded-2xl text-xs font-medium flex items-center gap-2"
                                    style={{
                                        background: 'rgba(248,113,113,0.10)',
                                        border: '1px solid rgba(248,113,113,0.25)',
                                        color: '#fca5a5',
                                        ...bd
                                    }}
                                >
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <motion.div
                                className="relative group"
                                custom={0}
                                variants={fieldVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors"
                                    style={{ color: 'var(--text-muted)' }}
                                />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="w-full rounded-full px-11 py-3 outline-none transition-all placeholder:opacity-50 text-sm"
                                    style={{
                                        background: 'rgba(139,92,246,0.06)',
                                        border: '1px solid rgba(139,92,246,0.20)',
                                        color: 'var(--page-text)',
                                        ...bd
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)'}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)'}
                                    required
                                />
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                custom={1}
                                variants={fieldVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full rounded-full px-11 py-3 outline-none transition-all placeholder:opacity-50 text-sm"
                                        style={{
                                            background: 'rgba(139,92,246,0.06)',
                                            border: '1px solid rgba(139,92,246,0.20)',
                                            color: 'var(--page-text)',
                                            ...bd
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)'}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)'}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end pr-2 mt-1.5">
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-medium transition-colors hover:text-violet-300"
                                        style={{ color: '#a78bfa', ...bd }}
                                    >
                                        Forgot?
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                custom={2}
                                variants={fieldVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(124,58,237,0.55)', transition: SPRING }}
                                whileTap={{ scale: 0.97, transition: SPRING }}
                                className="w-full font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-white"
                                style={{
                                    ...hl,
                                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                                    boxShadow: '0 0 25px rgba(124,58,237,0.35)'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            className="rounded-full h-4 w-4 border-b-2 border-white"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <span className="text-sm">Processing...</span>
                                    </>
                                ) : (
                                    <span className="text-sm">Sign In</span>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;