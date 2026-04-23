import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowLeft, Scan, AlertCircle, Hexagon, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        newpassword: '',
        oldpassword: '',
        confirmpassword: '',
    });
    const [verify, setVerify] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // send OTP Email
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const hl = { fontFamily: 'var(--font-headline)' };
    const bd = { fontFamily: 'var(--font-body)' };

    const inputStyle = {
        background: 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.20)',
        color: 'var(--page-text)',
        ...bd
    };

    const inputClass = "w-full rounded-full px-11 py-3 outline-none transition-all placeholder:opacity-50 text-sm";

    const focusIn = e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)';
    const focusOut = e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.20)';

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: 'var(--page-bg)' }}
        >
            {/* Helium Blob Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[130px] animate-blob"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.26) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] animate-blob"
                    style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)', animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[35%] w-[450px] h-[450px] rounded-full blur-[100px] animate-blob"
                    style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', animationDelay: '4s' }} />
            </div>

            {/* Split Card */}
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
                {/* Left Panel */}
                <div
                    className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, rgba(124,58,237,0.20) 0%, rgba(99,102,241,0.12) 60%, rgba(13,11,24,0.95) 100%)' }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[80px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)' }} />
                    <ArrowLeft
                        className="absolute top-8 left-8 h-6 w-6 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--page-text)' }}
                        onClick={() => navigate('/')}
                    />
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="mb-8 relative group cursor-default">
                            <div className="absolute inset-0 blur-2xl rounded-full group-hover:scale-110 transition-transform duration-700"
                                style={{ background: 'rgba(124,58,237,0.35)' }} />
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                                    <Hexagon className="h-32 w-32" style={{ color: 'rgba(139,92,246,0.25)' }} strokeWidth={1} />
                                </div>
                                <Hexagon className="h-32 w-32 relative z-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500"
                                    style={{ color: '#a78bfa', filter: 'drop-shadow(0 0 16px rgba(124,58,237,0.55))' }} strokeWidth={1.5} />
                                <div className="absolute z-20 transform group-hover:scale-110 transition-transform duration-300">
                                    <Scan className="h-14 w-14 text-white drop-shadow-lg" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-4xl italic mb-3 tracking-tight" style={{ ...hl, color: 'var(--page-text)' }}>
                            FormLens
                        </h1>
                        <p className="text-lg font-medium" style={{ ...bd, color: 'rgba(196,181,253,0.65)' }}>
                            Secure Access Retrieval.
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="relative p-6 sm:p-12 flex flex-col justify-center items-center overflow-hidden"
                    style={{ background: 'rgba(10,8,20,0.60)' }}>
                    <div className="absolute top-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full blur-[80px] pointer-events-none"
                        style={{ background: 'rgba(124,58,237,0.08)' }} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[280px] h-[280px] rounded-full blur-[70px] pointer-events-none"
                        style={{ background: 'rgba(99,102,241,0.07)' }} />

                    {/* Mobile back */}
                    <div className="lg:hidden w-full mb-6">
                        <ArrowLeft className="h-6 w-6 cursor-pointer hover:scale-110 transition" style={{ color: 'var(--page-text)' }}
                            onClick={() => navigate('/')} />
                    </div>

                    {/* Inner card */}
                    <div className="w-full max-w-sm rounded-[2rem] p-8 relative z-10"
                        style={{ background: 'rgba(18,14,35,0.80)', border: '1px solid rgba(139,92,246,0.20)', backdropFilter: 'blur(16px)', boxShadow: '0 10px 40px rgba(0,0,0,0.40)' }}>
                        <div className="mb-8 text-center">
                            <h3 className="text-2xl font-bold mb-2" style={{ ...hl, color: 'var(--page-text)' }}>
                                Forgotten Password?
                            </h3>
                            <p className="text-sm" style={{ ...bd, color: 'var(--text-muted)' }}>
                                {verify
                                    ? "Please enter your details to reset your password."
                                    : "Enter your email — we'll send a verification code."}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 rounded-2xl text-xs font-medium flex items-center gap-2"
                                style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.25)', color: '#fca5a5', ...bd }}>
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email / Old password */}
                            <div className="relative group">
                                {verify
                                    ? <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                    : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                }
                                <input
                                    type={verify ? "password" : "email"}
                                    name={verify ? "oldPassword" : "email"}
                                    value={verify ? formData.oldpassword : formData.email}
                                    onChange={handleChange}
                                    placeholder={verify ? "Old Password" : "Email"}
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={focusIn} onBlur={focusOut}
                                    required
                                />
                            </div>

                            {verify && (
                                <>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                        <input type="password" name="newPassword" value={formData.newpassword} onChange={handleChange}
                                            placeholder="New Password" className={inputClass} style={inputStyle}
                                            onFocus={focusIn} onBlur={focusOut} required />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                        <input type="password" name="confirmPassword" value={formData.confirmpassword} onChange={handleChange}
                                            placeholder="Confirm Password" className={inputClass} style={inputStyle}
                                            onFocus={focusIn} onBlur={focusOut} required />
                                    </div>
                                </>
                            )}

                            <button type="submit"
                                className="w-full font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] mt-2 text-white"
                                style={{ ...hl, background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', boxShadow: '0 0 25px rgba(124,58,237,0.35)' }}>
                                <span className="text-sm">Submit</span>
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;