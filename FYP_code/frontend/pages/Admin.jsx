import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity, Users, BookOpen, Clock3, ShieldCheck, ScanLine, Settings, LogOut } from 'lucide-react';

const SPRING = { type: 'spring', stiffness: 120, damping: 20 };
const BEZIER = [0.22, 1, 0.36, 1];

const hl = { fontFamily: 'var(--font-headline)' };
const bd = { fontFamily: 'var(--font-body)' };

const fadeInUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: BEZIER } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: BEZIER } },
};

const statCards = [
  { label: 'Total Students', value: '1,245', delta: '+12% this month', icon: Users, color: '#a78bfa' },
  { label: 'Active Courses', value: '28', delta: '3 updated today', icon: BookOpen, color: '#34d399' },
  { label: 'Pending Approvals', value: '12', delta: 'Needs attention', icon: Clock3, color: '#fbbf24' },
  { label: 'System Users', value: '156', delta: '+4 new accounts', icon: Activity, color: '#60a5fa' },
];

const recentActivity = [
  { text: 'New student registration approved', time: '30 mins ago' },
  { text: 'Course content updated — CS-401', time: '2 hours ago' },
  { text: 'System backup completed successfully', time: '5 hours ago' },
  { text: 'Document detection model refreshed', time: '12 hours ago' },
  { text: 'New admin user created', time: '1 day ago' },
];

const quickLinks = [
  { label: 'Document Detection', icon: ScanLine, path: '/detection' },
  { label: 'Workflow Editor', icon: Settings, path: '/workflow' },
];

export default function Admin({ setRole }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    let timer;
    const logout = async () => {
      setRole(null);
      localStorage.removeItem('auth_token');
      showAlert({ message: 'You have been logged out due to inactivity.', type: 'warning', duration: 10000 });
      navigate('/login');
    };
    const resetTimer = () => { clearTimeout(timer); timer = setTimeout(logout, 5 * 60 * 1000); };
    const events = ['click', 'mousemove', 'keydown', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => { events.forEach(e => window.removeEventListener(e, resetTimer)); clearTimeout(timer); };
  }, []);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: 'var(--page-bg, #05020f)' }}
    >
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[130px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mb-10 rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.20), rgba(99,102,241,0.12))',
            border: '1px solid rgba(139,92,246,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.45)' }}>
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={hl}>Admin Dashboard</h1>
              <p className="text-sm mt-1" style={{ ...bd, color: 'rgba(196,181,253,0.75)' }}>
                Monitor system performance, approvals, and activity.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex gap-3">
            {quickLinks.map(({ label, icon: Icon, path }) => (
              <motion.button
                key={label}
                onClick={() => navigate(path)}
                whileHover={{ y: -3, scale: 1.05, transition: SPRING }}
                whileTap={{ scale: 0.95, transition: SPRING }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: 'rgba(124,58,237,0.14)',
                  border: '1px solid rgba(139,92,246,0.24)',
                  color: '#c4b5fd',
                  ...bd,
                }}
              >
                <Icon size={15} />
                {label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => { setRole(null); navigate('/login'); }}
              whileHover={{ y: -3, scale: 1.05, transition: SPRING }}
              whileTap={{ scale: 0.95, transition: SPRING }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171', ...bd }}
            >
              <LogOut size={15} />
              Logout
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {statCards.map(({ label, value, delta, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.03, boxShadow: `0 20px 50px ${color}22`, transition: SPRING }}
              className="rounded-2xl p-6 cursor-default"
              style={{
                background: 'rgba(13,11,24,0.70)',
                border: '1px solid rgba(139,92,246,0.13)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ ...bd, color: 'var(--text-muted, rgba(148,163,184,1))' }}>{label}</span>
                <motion.div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}
                  whileHover={{ rotate: 15, scale: 1.2, transition: SPRING }}
                >
                  <Icon size={16} color={color} strokeWidth={1.5} />
                </motion.div>
              </div>
              <motion.p
                className="text-4xl font-bold mb-1"
                style={{ ...hl, color }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, ...SPRING }}
              >
                {value}
              </motion.p>
              <p className="text-xs" style={{ ...bd, color: 'var(--text-muted, rgba(148,163,184,0.7))' }}>{delta}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={stagger}
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(13,11,24,0.70)',
            border: '1px solid rgba(139,92,246,0.13)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.h2 variants={fadeInUp} className="text-xl font-bold text-white mb-6" style={hl}>
            Recent Activity
          </motion.h2>
          <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(139,92,246,0.10)' }}>
            {recentActivity.map(({ text, time }, i) => (
              <motion.div
                key={text}
                variants={slideInLeft}
                custom={i}
                whileHover={{ x: 6, transition: SPRING }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-4 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#7c3aed' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <p className="text-sm" style={{ ...bd, color: 'rgba(226,232,240,0.90)' }}>{text}</p>
                </div>
                <span className="text-xs ml-5 sm:ml-0 flex-shrink-0" style={{ ...bd, color: 'var(--text-muted)' }}>{time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
