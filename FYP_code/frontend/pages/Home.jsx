import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Plus, Minus, ArrowUpRight } from 'lucide-react';

/* ─── ANIMATION UTILS ─── */
const EASE = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: EASE, delay } },
});
const stg = (s = 0.1) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } });

function Reveal({ children, id, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.section ref={ref} id={id} variants={stg(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={`relative ${className}`}>
            {children}
        </motion.section>
    );
}

/* ─── CSS 3D-SPHERE HELPER ─── */
function GreenSphere({ size = 320, className = '', style = {} }) {
    return (
        <div className={`rounded-full pointer-events-none ${className}`}
            style={{
                width: size, height: size,
                background: 'radial-gradient(circle at 35% 35%, #22c55e 0%, #166534 45%, #052e16 80%, #000 100%)',
                boxShadow: '0 0 120px rgba(34,197,94,0.25), inset 0 0 60px rgba(0,0,0,0.5)',
                flexShrink: 0, ...style
            }} />
    );
}

/* ─── NAVBAR ─── */
function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5">
            <Link to="/" className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="black" /><rect x="9" y="1" width="6" height="6" rx="1" fill="black" /><rect x="1" y="9" width="6" height="6" rx="1" fill="black" /><rect x="9" y="9" width="6" height="6" rx="1" fill="black" /></svg>
            </Link>
            <nav className="hidden md:flex items-center gap-7 px-8 py-3 rounded-full"
                style={{ background: 'rgba(13,13,13,0.88)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {['How it works', 'Services', 'Case Studies', 'Pricing', 'Blogs', 'About'].map(n => (
                    <a key={n} href={`#${n.toLowerCase().replace(/ /g, '-')}`}
                        className="text-[13px] text-slate-300 hover:text-white font-medium transition-colors">{n}</a>
                ))}
            </nav>
            <Link to="/login" className="px-5 py-2.5 bg-white text-black text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Login
            </Link>
        </header>
    );
}

/* ─── HERO ─── */
const TESTIMONIALS_HERO = [
    { quote: '"Deployed in 7 days. No meetings. No blockers."', name: 'Emma Valdez', role: 'CX Lead, OrbitAI' },
    { quote: '"Data dashboards now run themselves. We just watch."', name: 'Jamal Ortiz', role: 'Co-founder, Taskflux' },
];

function Hero() {
    const [tIdx, setTIdx] = useState(0);
    React.useEffect(() => { const t = setInterval(() => setTIdx(i => (i + 1) % TESTIMONIALS_HERO.length), 4000); return () => clearInterval(t); }, []);
    const t = TESTIMONIALS_HERO[tIdx];

    return (
        <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-28 pb-20 overflow-hidden">
            {/* Giant persistent green orb – top right */}
            <div className="fixed top-[-60px] right-[-100px] z-0 pointer-events-none opacity-90">
                <GreenSphere size={420} />
            </div>

            {/* Subtle left orb that appears lower */}
            <div className="fixed bottom-[30%] left-[-140px] z-0 pointer-events-none opacity-40">
                <GreenSphere size={340} />
            </div>

            <div className="relative z-10 max-w-3xl">
                {/* Rotating testimonial above hero */}
                <AnimatePresence mode="wait">
                    <motion.div key={tIdx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, ease: EASE }} className="mb-10">
                        <p className="text-slate-300 italic text-[15px] mb-3">{t.quote}</p>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-800 border-2 border-emerald-500 overflow-hidden shrink-0">
                                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-800" />
                            </div>
                            <span className="text-[13px] text-white font-semibold">{t.name} <span className="text-slate-500 font-normal">{t.role}</span></span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Main heading */}
                <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.05 }}
                    className="text-6xl md:text-8xl font-black text-white tracking-[-0.035em] leading-[1.0] mb-8">
                    Automate,<br />Optimize, Scale<br />With AI
                </motion.h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg text-slate-400 leading-[1.65] max-w-[500px] mb-10">
                    Boost efficiency and eliminate repetitive tasks with AI-powered form processing solutions tailored to your university needs.
                </motion.p>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex items-center gap-4">
                    <Link to="/login" className="px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-2xl transition-colors">
                        Login
                    </Link>
                    <a href="#services" className="px-7 py-4 bg-[#1a1a1a] hover:bg-[#252525] text-white text-sm font-bold rounded-2xl border border-white/5 transition-colors">
                        Our Services
                    </a>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="mt-16 text-[13px] text-slate-500">
                    Trusted by 150+ startups &amp; teams
                </motion.p>
            </div>
        </section>
    );
}

/* ─── LOGO GRID (Trusted By) ─── */
const LOGOS = ['logoipsum', 'logo–ipsum', 'Logoipsum', '标识', 'ロゴ', 'logo ipsum'];
function LogoGrid() {
    return (
        <div className="py-12 border-y border-white/5">
            <div className="max-w-3xl mx-auto px-8 grid grid-cols-3 gap-x-16 gap-y-8 place-items-center">
                {LOGOS.map((name, i) => (
                    <span key={i} className="text-slate-600 font-bold text-base md:text-xl tracking-tight opacity-70 hover:opacity-100 transition-opacity">{name}</span>
                ))}
            </div>
        </div>
    );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
    return (
        <Reveal id="how-it-works" className="py-28 px-6 max-w-6xl mx-auto">
            <motion.p variants={fadeUp()} className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">PROCESS</motion.p>
            <motion.h2 variants={fadeUp(0.05)} className="text-5xl md:text-[64px] font-black text-white tracking-[-0.03em] leading-[1.05] mb-20">
                How it works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1 */}
                <motion.div variants={fadeUp(0.1)} className="rounded-[28px] overflow-hidden flex flex-col" style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="p-7 flex-1">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-black text-xl mb-6">1</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Share Your Workflow</h3>
                        <p className="text-slate-400 text-[15px] leading-relaxed">From lead gen to client onboarding, just share your workflow and the tools you use.</p>
                    </div>
                    {/* In-card graphic */}
                    <div className="mx-5 mb-5 p-4 rounded-2xl bg-[#161616] border border-white/5 flex gap-3 items-end justify-center h-28">
                        <div className="w-12 h-14 rounded-xl bg-[#1E1E1E] border border-white/10 flex items-center justify-center">
                            <div className="w-6 h-7 rounded bg-slate-600 opacity-70" />
                        </div>
                        <div className="w-12 h-10 rounded-xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center">
                            <div className="w-5 h-5 rounded bg-emerald-600 opacity-70" />
                        </div>
                    </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div variants={fadeUp(0.15)} className="rounded-[28px] overflow-hidden flex flex-col" style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="p-7 flex-1">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-black text-xl mb-6">2</div>
                        <h3 className="text-2xl font-bold text-white mb-3">We Build the System</h3>
                        <p className="text-slate-400 text-[15px] leading-relaxed">We design custom automations that connect your tools with AI—so work happens while you sleep.</p>
                    </div>
                    <div className="mx-5 mb-5 p-4 rounded-2xl bg-[#161616] border border-white/5 flex gap-2 items-end justify-center h-28">
                        {[40, 60, 45, 75, 55].map((h, i) => (
                            <div key={i} className="w-6 rounded-t-md" style={{ height: `${h}%`, background: i === 3 ? '#22c55e' : '#1E2920', border: '1px solid rgba(34,197,94,0.2)' }} />
                        ))}
                    </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div variants={fadeUp(0.2)} className="rounded-[28px] overflow-hidden flex flex-col" style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="p-7 flex-1">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black font-black text-xl mb-6">3</div>
                        <h3 className="text-2xl font-bold text-white mb-3">Launch and Take Control</h3>
                        <p className="text-slate-400 text-[15px] leading-relaxed">You get a plug-and-play dashboard with a walkthrough to manage everything easily.</p>
                    </div>
                    {/* Mini dashboard mockup */}
                    <div className="mx-5 mb-5 rounded-2xl bg-[#161616] border border-white/5 overflow-hidden h-28">
                        <div className="flex gap-1.5 items-center px-3 py-2 border-b border-white/5">
                            <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-60" />
                            <div className="w-2 h-2 rounded-full bg-green-500 opacity-60" />
                        </div>
                        <div className="p-3 flex gap-2">
                            <div className="w-1/3 space-y-1.5">
                                <div className="h-2 rounded bg-slate-700 w-full" />
                                <div className="h-2 rounded bg-slate-700 w-3/4" />
                                <div className="h-2 rounded bg-emerald-700 w-full" />
                            </div>
                            <div className="flex-1 rounded-lg bg-[#0a0a0a] border border-white/5" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </Reveal>
    );
}

/* ─── SERVICES (What We Offer) ─── */
function Services() {
    return (
        <Reveal id="services" className="py-28 px-6 max-w-6xl mx-auto">
            <motion.p variants={fadeUp()} className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">SERVICES</motion.p>
            <motion.h2 variants={fadeUp(0.05)} className="text-5xl md:text-[64px] font-black text-white tracking-[-0.03em] mb-16">
                What We Offer
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1 – Workflow simulation */}
                <ServiceCard delay={0.05} title="Form Field Detection" desc="Automate form field recognition, label extraction, and engagement from any document.">
                    <div className="space-y-2">
                        {[['📄', 'Admission Form', 'Scanning…'], ['📊', 'AirTable', 'Send data to DB'], ['🔍', 'ONNX Model', 'Run inference']].map(([ic, label, sub]) => (
                            <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{ic}</span>
                                    <span className="text-xs text-white font-medium">{label}</span>
                                </div>
                                <span className="text-[10px] text-emerald-400">{sub}</span>
                            </div>
                        ))}
                    </div>
                </ServiceCard>

                {/* Card 2 – Bar chart comparison */}
                <ServiceCard delay={0.1} title="Data Processing & Insights" desc="Turn raw form data into actionable insights with AI-driven analysis and reporting.">
                    <div className="flex flex-col gap-2 h-full">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Before</span><span className="text-emerald-400">After FormLens <span className="font-bold">87% +</span></span>
                        </div>
                        <div className="flex items-end gap-2 h-20">
                            {[30, 50, 38, 65, 45, 80, 90].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i > 3 ? 'linear-gradient(to top, #166534, #22c55e)' : '#1f2937' }} />
                            ))}
                        </div>
                    </div>
                </ServiceCard>

                {/* Card 3 – Chat bubble */}
                <ServiceCard delay={0.15} title="AI-Powered Chatbots" desc="Enhance student support with intelligent, 24/7 AI chatbots that handle queries instantly.">
                    <div className="space-y-2">
                        <div className="flex justify-end">
                            <div className="bg-slate-700 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                                <p className="text-[11px] text-slate-300">What are your business hours?</p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-end">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                            <div className="px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                <p className="text-[11px] text-emerald-300">We are here 24/7, let me know how I can help you.</p>
                                <p className="text-[9px] text-emerald-600 mt-1">Automated Response</p>
                            </div>
                        </div>
                    </div>
                </ServiceCard>

                {/* Card 4 – Multi-chat thread (Workflow Automation) */}
                <ServiceCard delay={0.2} title="Workflow Automation" desc="Streamline repetitive tasks with AI-driven workflows that save time and boost efficiency.">
                    <div className="space-y-1.5">
                        {[['Emma', 'Looking to automate inventory…'], ['Liam', 'How does AI handle financial…'], ['Olivia', 'Looking for AI automation…']].map(([name, msg]) => (
                            <div key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-white font-bold">{name}</p>
                                    <p className="text-[9px] text-slate-500 truncate w-36">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ServiceCard>

                {/* Card 5 – Floating integration bubbles */}
                <ServiceCard delay={0.25} title="Custom AI Integrations" desc="Seamlessly connect AI tools with your existing software — no technical setup required.">
                    <div className="relative h-32">
                        {[
                            { label: '↗', top: '10%', left: '60%', c: '#4f46e5' },
                            { label: 'N', top: '30%', left: '20%', c: '#374151' },
                            { label: '✦', top: '55%', left: '65%', c: '#7c3aed' },
                            { label: 'M', top: '65%', left: '30%', c: '#1d4ed8' },
                            { label: '⬡', top: '15%', left: '40%', c: '#065f46' },
                        ].map((b, i) => (
                            <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                                className="absolute w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white/10"
                                style={{ background: b.c, top: b.top, left: b.left }}>
                                {b.label}
                            </motion.div>
                        ))}
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-[30%] left-[44%] w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900">
                            <div className="w-5 h-5 rounded bg-white opacity-90" />
                        </motion.div>
                    </div>
                </ServiceCard>

                {/* Card 6 – empty/stats card */}
                <ServiceCard delay={0.3} title="Analytics Dashboard" desc="Track form detection accuracy, processing time, and field extraction confidence live.">
                    <div className="grid grid-cols-2 gap-3">
                        {[['82%', 'Accuracy'], ['<1s', 'Speed'], ['5+', 'Layouts'], ['100%', 'Offline']].map(([v, l]) => (
                            <div key={l} className="rounded-xl p-3 text-center" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                                <p className="text-2xl font-black text-emerald-400">{v}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{l}</p>
                            </div>
                        ))}
                    </div>
                </ServiceCard>
            </div>
        </Reveal>
    );
}

function ServiceCard({ children, title, desc, delay = 0 }) {
    return (
        <motion.div variants={fadeUp(delay)} className="rounded-[28px] overflow-hidden flex flex-col"
            style={{ background: '#101010', border: '1px solid rgba(255,255,255,0.07)' }}
            whileHover={{ y: -6, borderColor: 'rgba(34,197,94,0.2)' }}>
            {/* In-card graphic area */}
            <div className="p-5 h-44 flex items-center justify-center" style={{ background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {children}
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-[14px] leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}

/* ─── CASE STUDIES (Sticky Scroll Stacking) ─── */
const CASES = [
    {
        cat: 'Admission Process',
        title: 'How FormLens Cut FAST-NU Admission Form Processing Time by 60%',
        body: 'Automated field extraction from 500+ hand-filled admission forms per semester. Data routed directly into the student database—no manual transcription needed.',
        s1: ['60%', 'Faster Processing'],
        s2: ['500+', 'Forms Automated'],
        color: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
        tag: '⬡ DETECTION',
        visual: ['Admission Form', 'Registration No.', 'Father Name', 'Program', 'CNIC', '→ DB'],
    },
    {
        cat: 'Fee Vouchers',
        title: 'How FormLens Eliminated Manual Fee Voucher Data Entry Entirely',
        body: 'ONNX vision model identifies printed and handwritten fee amounts, student IDs, and payment dates from scanned vouchers with 82%+ accuracy.',
        s1: ['82%', 'Detection Accuracy'],
        s2: ['<1s', 'Per Form Inference'],
        color: 'linear-gradient(145deg, #200122, #6f0000)',
        tag: '⬡ AI MODEL',
        visual: ['Fee Voucher', 'Amount: 50,000', 'Ref #: FV-2024', 'Date: Jan 25', '✓ Verified'],
    },
    {
        cat: 'Workflow Automation',
        title: 'Multi-Step Routing Pipeline Built for University Admin Using ReactFlow',
        body: 'Admin staff can design custom multi-step form routing pipelines visually — no code needed. Forms auto-route by type: admission → finance → registrar.',
        s1: ['3', 'Dept Connections'],
        s2: ['100%', 'No-Code Setup'],
        color: 'linear-gradient(145deg, #0a3d0a, #1a5c1a)',
        tag: '⬡ WORKFLOW',
        visual: ['Upload Node', '↓', 'Detect Type', '↓', 'Route Dept', '↓', 'Notify Admin'],
    },
];

function CaseStudies() {
    return (
        <section id="case-studies" className="py-28 px-6">
            <div className="max-w-6xl mx-auto">
                <p className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4">CASE STUDIES</p>
                <h2 className="text-5xl md:text-[64px] font-black text-white tracking-[-0.03em] mb-4">Our Recent Work</h2>
                <p className="text-slate-500 text-lg mb-20">Real outcomes. Real data. Built for Pakistani universities.</p>
            </div>

            {/* Sticky scroll stack — each card sticks at a descending top offset */}
            <div className="max-w-6xl mx-auto space-y-6">
                {CASES.map((c, i) => (
                    <div key={i} className="sticky" style={{ top: `${80 + i * 24}px`, zIndex: 10 + i }}>
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="rounded-[28px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl"
                            style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.08)' }}>

                            {/* Text side */}
                            <div className="p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{c.cat}</span>
                                        <span className="text-[10px] text-slate-700">{c.tag}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-[28px] font-black text-white leading-[1.25] mb-4">{c.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{c.body}</p>
                                </div>
                                <div className="flex gap-10 mt-8">
                                    <div>
                                        <p className="text-4xl font-black text-white">{c.s1[0]}</p>
                                        <p className="text-slate-500 text-xs mt-1">{c.s1[1]}</p>
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-white">{c.s2[0]}</p>
                                        <p className="text-slate-500 text-xs mt-1">{c.s2[1]}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual side — gradient + form data visualization */}
                            <div className="relative min-h-[280px] flex items-center justify-center overflow-hidden" style={{ background: c.color }}>
                                <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center z-10">
                                    <ArrowUpRight size={15} className="text-white" />
                                </button>

                                {/* Simulated form/pipeline mockup */}
                                <div className="w-[220px] p-4 rounded-2xl space-y-2" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                                    {c.visual.map((line, j) => (
                                        <motion.div key={j}
                                            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }} transition={{ delay: j * 0.08, ease: EASE }}
                                            className={`text-xs px-2 py-1.5 rounded-lg ${j === 0 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : line === '↓' ? 'text-emerald-500 text-center text-lg leading-none py-0' : 'text-slate-300'}`}>
                                            {line}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Decorative glow */}
                                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-30" style={{ background: '#22c55e' }} />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
            {/* spacer so last sticky card scrolls away */}
            <div className="h-24" />
        </section>
    );
}


/* ─── ROI CALCULATOR ─── */
function ROICalc() {
    const [team, setTeam] = useState(12);
    const [hours, setHours] = useState(10);
    const [cost, setCost] = useState(40);

    const totalHours = team * hours * 4; // monthly
    const totalCost = totalHours * cost;
    const savings = Math.round(totalCost * 0.75);

    return (
        <Reveal className="py-28 px-6">
            <div className="max-w-2xl mx-auto">
                <motion.p variants={fadeUp()} className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4 text-center">CALCULATOR</motion.p>
                <motion.h2 variants={fadeUp(0.05)} className="text-5xl font-black text-white tracking-tight text-center mb-12">
                    Calculate Your<br />Automation ROI
                </motion.h2>

                <motion.div variants={fadeUp(0.1)} className="p-8 rounded-[28px]"
                    style={{ background: '#101010', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {/* Sliders */}
                    {[
                        { label: 'Team size', val: team, set: setTeam, min: 1, max: 100, display: team },
                        { label: 'Weekly hours spent on manual work (per employee)', val: hours, set: setHours, min: 1, max: 40, display: hours },
                        { label: 'Average hourly cost ($)', val: cost, set: setCost, min: 10, max: 200, display: `$${cost}` },
                    ].map(({ label, val, set, min, max, display }) => (
                        <div key={label} className="mb-7">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-slate-300">{label}</label>
                                <span className="text-sm text-white font-bold">{display}</span>
                            </div>
                            <input type="range" min={min} max={max} value={val} onChange={e => set(+e.target.value)}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                style={{ background: `linear-gradient(to right, #22c55e ${((val - min) / (max - min)) * 100}%, #1f2937 ${((val - min) / (max - min)) * 100}%)` }} />
                        </div>
                    ))}

                    {/* Result */}
                    <div className="mt-8 p-6 rounded-2xl" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <p className="text-white font-bold text-lg leading-relaxed">
                            You lose <span className="text-emerald-400">{totalHours.toLocaleString()} hours/month</span> on repetitive tasks!<br />
                            This represents a cost of <span className="text-emerald-400">${totalCost.toLocaleString()}/month</span> in lost time.
                        </p>
                        <p className="text-slate-400 text-sm mt-2">With FormLens, save 75%, or ${savings.toLocaleString()}/month!</p>
                    </div>

                    <button className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-colors">
                        Get Custom Automation Plan
                    </button>
                </motion.div>
            </div>
        </Reveal>
    );
}

/* ─── PRICING ─── */
const PLANS = [
    { name: 'STARTER', desc: 'For Small businesses and startups looking to automate basic workflows.', price: '$1,999', period: 'PER MONTH, BILLED MONTHLY', btn: 'dark', items: ['Access to our AI automation platform', '5 pre-built templates for common tasks', 'Support for up to 100 automated tasks', 'Up to 3 team members'] },
    { name: 'GROWTH', desc: 'For Growing businesses seeking to automate more complex workflows.', price: '$3,999', period: 'PER MONTH, BILLED MONTHLY', btn: 'light', tag: 'Most Popular', items: ['Advanced analytics and reporting', 'Everything in Starter', '20 pre-built templates for advanced tasks', 'Support for up to 500 automated tasks', 'Priority customer support'] },
    { name: 'ENTERPRISE', desc: 'For Large enterprises requiring customized AI automation solutions.', price: 'Custom', period: 'PER MONTH, BILLED MONTHLY', btn: 'dark', items: ['Advanced security and compliance', 'Everything in Growth', 'Dedicated account manager', 'Support for unlimited automated tasks', 'Custom workflow development'] },
];

function Sphere3D({ size = 56 }) {
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 35% 32%, #4ade80 0%, #16a34a 40%, #052e16 80%, #000 100%)', boxShadow: '0 0 30px rgba(34,197,94,0.25)', marginBottom: 24 }} />
    );
}

function Pricing() {
    const [yearly, setYearly] = useState(false);
    return (
        <Reveal id="pricing" className="py-28 px-6 max-w-6xl mx-auto">
            <motion.h2 variants={fadeUp()} className="text-5xl md:text-[64px] font-black text-white tracking-[-0.03em] text-center mb-10">
                Our Subscriptions
            </motion.h2>
            <motion.div variants={fadeUp(0.05)} className="flex justify-center mb-14">
                <div className="inline-flex p-1.5 rounded-full" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Monthly', 'Yearly'].map(opt => (
                        <button key={opt} onClick={() => setYearly(opt === 'Yearly')}
                            className="px-6 py-2 text-sm font-semibold rounded-full transition-all"
                            style={{ background: (opt === 'Yearly') === yearly ? '#1a1a1a' : 'transparent', color: (opt === 'Yearly') === yearly ? '#fff' : '#6b7280' }}>
                            {opt}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANS.map((p, i) => (
                    <motion.div key={p.name} variants={fadeUp(i * 0.1)} className="rounded-[28px] p-7 flex flex-col relative"
                        style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {p.tag && (
                            <span className="absolute top-5 right-5 text-[11px] font-bold bg-white/10 border border-white/15 text-white px-3 py-1 rounded-full">{p.tag}</span>
                        )}
                        <Sphere3D size={p.tag ? 64 : 52} />
                        <p className="text-xs font-bold tracking-[0.1em] text-white mb-2">{p.name}</p>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed min-h-[40px]">{p.desc}</p>
                        <div className="border-t border-white/5 pt-6 mb-6">
                            <p className="text-4xl font-black text-white tracking-tight">{yearly && p.price !== 'Custom' ? `$${Math.round(parseInt(p.price.replace('$', '').replace(',', '')) * 0.8).toLocaleString()}` : p.price}</p>
                            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">{p.period}</p>
                        </div>
                        <button className="w-full py-3.5 mb-8 rounded-2xl text-sm font-bold transition-colors"
                            style={{ background: p.btn === 'light' ? '#fff' : '#1a1a1a', color: p.btn === 'light' ? '#000' : '#fff', border: p.btn === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                            Get Started
                        </button>
                        <ul className="space-y-3 flex-1">
                            {p.items.map(it => (
                                <li key={it} className="flex items-start gap-2.5 text-[13px] text-slate-400">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {it}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </Reveal>
    );
}

/* ─── TESTIMONIALS (Premium 3D Auto-Sliding Carousel) ─── */
const TESTI = [
    {
        q: 'This FYP pushed the boundary of what we expected from undergrad work. The ONNX-based detection pipeline, admin workflow builder, and role-based system all function cohesively. A solid research contribution.',
        name: 'Sir Omer Usman Khan',
        role: 'FYP Supervisor, FAST-NU Peshawar (CS Dept.)',
        avatar: 'OU',
    },
    {
        q: 'I led the AI model training pipeline — from data annotation using LabelImg to exporting the custom-trained YOLOv8 model to ONNX runtime. Getting 82%+ mAP on unseen university form layouts was the biggest technical win.',
        name: 'Ubaid Ur Rehman',
        role: 'FYP Member, FAST-NU Peshawar',
        avatar: 'UR',
    },
    {
        q: 'My focus was the ReactFlow workflow builder and backend integration. Building a no-code pipeline editor inside a Django + React stack with live node execution was challenging but incredibly rewarding.',
        name: 'M Sarmad Khan',
        role: 'FYP Member, FAST-NU Peshawar',
        avatar: 'SK',
    },
    {
        q: 'I handled the frontend design system, authentication flows, and admin/student dashboards. Going from a basic interface to a full Helium-inspired glassmorphic UI was a big design challenge I am proud of.',
        name: 'Bilal Ahmed',
        role: 'FYP Member, FAST-NU Peshawar',
        avatar: 'BA',
    },
];


function Testimonials() {
    const [idx, setIdx] = React.useState(0);
    const [dir, setDir] = React.useState(1); // 1=right, -1=left
    const total = TESTI.length;

    React.useEffect(() => {
        const timer = setInterval(() => { setDir(1); setIdx(i => (i + 1) % total); }, 4500);
        return () => clearInterval(timer);
    }, [total]);

    const go = (d) => { setDir(d); setIdx(i => (i + d + total) % total); };

    const prev = (idx - 1 + total) % total;
    const next = (idx + 1) % total;

    // Card variants: slide + blur + rotate
    const variants = {
        enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.85, rotateY: d > 0 ? 18 : -18, filter: 'blur(12px)' }),
        center: { x: 0, opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
        exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0, scale: 0.85, rotateY: d > 0 ? -18 : 18, filter: 'blur(12px)', transition: { duration: 0.5, ease: EASE } }),
    };

    return (
        <section className="py-28 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <p className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4 text-center">TESTIMONIALS</p>
                <h2 className="text-5xl md:text-[56px] font-black text-white tracking-tight mb-20 text-center">
                    What They Say
                </h2>

                {/* ── Carousel wrapper ── */}
                <div className="relative" style={{ perspective: '1000px' }}>

                    {/* Ghost cards left + right */}
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[240px] opacity-20 scale-90 -translate-x-14 pointer-events-none" style={{ filter: 'blur(3px)' }}>
                        <TestiCard t={TESTI[prev]} />
                    </div>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[240px] opacity-20 scale-90 translate-x-14 pointer-events-none" style={{ filter: 'blur(3px)' }}>
                        <TestiCard t={TESTI[next]} />
                    </div>

                    {/* Active card with slide/blur/rotate animation */}
                    <div className="relative z-10 md:mx-24">
                        <AnimatePresence mode="wait" custom={dir}>
                            <motion.div
                                key={idx}
                                custom={dir}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full"
                            >
                                <div className="p-10 md:p-14 rounded-[36px] relative overflow-hidden"
                                    style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 0 80px rgba(34,197,94,0.08)' }}>
                                    {/* Large rotating quote mark */}
                                    <motion.div
                                        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.04, 0.98, 1] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute top-6 right-8 text-[120px] leading-none font-black select-none"
                                        style={{ color: 'rgba(34,197,94,0.07)' }}>
                                        "
                                    </motion.div>

                                    {/* Top accent glow blob */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
                                        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />

                                    <p className="text-2xl md:text-[28px] font-bold text-white leading-[1.5] tracking-tight mb-10 relative z-10">
                                        "{TESTI[idx].q}"
                                    </p>

                                    <div className="flex items-center gap-4 relative z-10">
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg"
                                            style={{ background: `linear-gradient(135deg, #22c55e, #059669)`, boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}>
                                            {TESTI[idx].avatar}
                                        </motion.div>
                                        <div>
                                            <p className="text-white font-bold text-lg">{TESTI[idx].name}</p>
                                            <p className="text-emerald-500 text-sm mt-0.5">{TESTI[idx].role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Nav buttons */}
                    <button onClick={() => go(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button onClick={() => go(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                </div>

                {/* Dot nav */}
                <div className="flex justify-center gap-2 mt-10">
                    {TESTI.map((_, i) => (
                        <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                            className="rounded-full transition-all duration-300"
                            style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? '#22c55e' : 'rgba(255,255,255,0.15)' }} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* Small dimmed ghost card used on left/right */
function TestiCard({ t }) {
    return (
        <div className="p-6 rounded-[28px]" style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-4">"{t.q}"</p>
            <p className="text-white text-xs font-bold">{t.name}</p>
            <p className="text-emerald-600 text-[10px]">{t.role}</p>
        </div>
    );
}


/* ─── FAQ ─── */
const FAQS = [
    { q: 'How can AI automation help my business?', a: 'By instantly processing raw form uploads into structured data, cutting admin hours permanently and eliminating data entry errors.' },
    { q: 'What industries do you serve?', a: 'Higher education institutions, healthcare, finance, and any organization dealing with high-volume paper or digital form processing.' },
    { q: 'How long does it take to implement AI automation?', a: 'With our pre-trained models, initial deployment takes 7 days or less. Custom model training typically adds 2–3 weeks.' },
    { q: 'Is my data secure with AI automation?', a: 'Yes. All processing runs on-premise or in your secure cloud. We never retain or share your form data with third parties.' },
    { q: 'Can I get a demo before committing?', a: 'Absolutely. Book a call and our team will walk you through a live demo tailored to your specific form workflows.' },
];

function FAQ() {
    const [open, setOpen] = useState(0);
    return (
        <Reveal id="faq" className="py-28 px-6 max-w-3xl mx-auto">
            <motion.h2 variants={fadeUp()} className="text-5xl font-black text-white tracking-tight mb-16">FAQs</motion.h2>
            <div className="space-y-3">
                {FAQS.map((f, i) => (
                    <motion.div key={i} variants={fadeUp(i * 0.06)} className="overflow-hidden rounded-2xl"
                        style={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-6 text-left gap-4">
                            <span className="text-[16px] font-semibold text-white">{f.q}</span>
                            {open === i ? <Minus size={18} className="text-emerald-400 shrink-0" /> : <Plus size={18} className="text-slate-500 shrink-0" />}
                        </button>
                        <AnimatePresence initial={false}>
                            {open === i && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                                    <p className="px-6 pb-6 text-[15px] text-slate-400 leading-[1.65]">{f.a}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </Reveal>
    );
}

/* ─── CONTACT ─── */
function Contact() {
    return (
        <Reveal id="contact" className="py-28 px-6 border-t border-white/5">
            <motion.p variants={fadeUp()} className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase mb-4 text-center">GET IN TOUCH</motion.p>
            <motion.h2 variants={fadeUp(0.05)} className="text-5xl font-black text-white text-center mb-14">Contact</motion.h2>
            <motion.div variants={fadeUp(0.1)} className="flex flex-col md:flex-row justify-center gap-16 text-center">
                {[['Mail', 'hello@formlens.com'], ['Phone', '+92 300 000 0000'], ['Office', 'FAST-NU Peshawar Campus']].map(([label, val]) => (
                    <div key={label}>
                        <p className="text-emerald-400 text-sm font-semibold mb-2">{label}</p>
                        <p className="text-white font-bold text-lg">{val}</p>
                    </div>
                ))}
            </motion.div>
            {/* Contact form */}
            <motion.form variants={fadeUp(0.15)} className="max-w-lg mx-auto mt-14 space-y-4" onSubmit={e => e.preventDefault()}>
                {[['Full Name', 'text'], ['Company Name', 'text'], ['Email', 'email']].map(([ph, t]) => (
                    <input key={ph} type={t} placeholder={ph} required
                        className="w-full px-5 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', }} />
                ))}
                <textarea placeholder="Message" rows={4} className="w-full px-5 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500 outline-none resize-none" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }} />
                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl transition-colors">Submit</button>
            </motion.form>
        </Reveal>
    );
}

/* ─── FOOTER ─── */
function Footer() {
    return (
        <footer className="py-16 border-t border-white/5 text-center px-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-600 tracking-tight leading-[1.2]">
                You don't need more people.<br />
                <span className="text-white">You need better systems.</span>
            </h2>
            <div className="mt-10 mb-8 flex justify-center">
                <Link to="/" className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="black" /><rect x="9" y="1" width="6" height="6" rx="1" fill="black" /><rect x="1" y="9" width="6" height="6" rx="1" fill="black" /><rect x="9" y="9" width="6" height="6" rx="1" fill="black" /></svg>
                </Link>
            </div>
            <p className="text-slate-600 text-sm">© 2026 FormLens · FAST-NU Peshawar</p>
        </footer>
    );
}

/* ─── MAIN EXPORT ─── */
export default function Home() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#000000', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <style>{`
                input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #22c55e; cursor: pointer; box-shadow: 0 0 8px rgba(34,197,94,0.5); }
                input[type=range]::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #22c55e; cursor: pointer; border: none; }
                input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 99px; outline: none; }
            `}</style>
            <Navbar />
            <Hero />
            <LogoGrid />
            <HowItWorks />
            <Services />
            <CaseStudies />
            <ROICalc />
            <Testimonials />
            <Pricing />
            <FAQ />
            <Contact />
            <Footer />
        </div>
    );
}