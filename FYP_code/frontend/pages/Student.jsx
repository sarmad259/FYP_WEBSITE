import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpenCheck, Trophy, Bell, LogOut } from 'lucide-react';

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
  visible: { transition: { staggerChildren: 0.1 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: BEZIER } },
};

const statCards = [
  { label: 'Enrolled Courses', value: '5', icon: BookOpenCheck, color: '#a78bfa' },
  { label: 'GPA', value: '3.85', icon: Trophy, color: '#34d399' },
  { label: 'Attendance', value: '92%', icon: Bell, color: '#60a5fa' },
];

const announcements = [
  { text: 'New assignment posted in Data Structures course', time: '2 hours ago' },
  { text: 'Midterm exam schedule announced', time: '1 day ago' },
  { text: 'Library hours extended for exam week', time: '2 days ago' },
];

export default function Student({ setRole }) {
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
  }, [navigate, showAlert, setRole]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'var(--page-bg, #05020f)' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[130px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)', animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="mb-10 rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.20), rgba(52,211,153,0.10))',
            border: '1px solid rgba(99,102,241,0.20)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-4">
            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', boxShadow: '0 0 24px rgba(99,102,241,0.45)' }}>
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={hl}>Student Dashboard</h1>
              <p className="text-sm mt-1" style={{ ...bd, color: 'rgba(196,181,253,0.75)' }}>
                Track your progress, courses, and updates.
              </p>
            </div>
          </motion.div>

          <motion.button
            variants={fadeInUp}
            onClick={() => { setRole(null); navigate('/login'); }}
            whileHover={{ y: -3, scale: 1.05, transition: SPRING }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171', ...bd }}
          >
            <LogOut size={15} />
            Logout
          </motion.button>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
        >
          {statCards.map(({ label, value, icon: Icon, color }, i) => (
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
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ ...bd, color: 'var(--text-muted)' }}>{label}</span>
                <motion.div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18` }}
                  whileHover={{ rotate: 15, scale: 1.2, transition: SPRING }}
                >
                  <Icon size={16} color={color} strokeWidth={1.5} />
                </motion.div>
              </div>
              <motion.p
                className="text-4xl font-bold"
                style={{ ...hl, color }}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, ...SPRING }}
              >
                {value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Announcements */}
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
            Recent Announcements
          </motion.h2>
          <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(139,92,246,0.10)' }}>
            {announcements.map(({ text, time }, i) => (
              <motion.div
                key={text}
                variants={slideInLeft}
                whileHover={{ x: 6, transition: SPRING }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-4 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: '#6366f1' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
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
