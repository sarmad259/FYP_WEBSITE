import { useReducer, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Upload, X, ScanLine, FileImage, Clock, Hash, Clipboard, Check, AlertCircle } from 'lucide-react';
import { api } from '../src/index';

const SPRING = { type: 'spring', stiffness: 120, damping: 20 };
const BEZIER = [0.22, 1, 0.36, 1];

const initialState = {
    file: null,
    preview: null,
    meta: "",
    isDragging: false,
    loading: false,
    results: null,
    error: "",
    copied: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_FILE":
            return {
                ...state,
                file: action.file,
                meta: action.meta,
                preview: action.preview,
                results: null,
                error: "",
            };

        case "LOADING":
            return { ...state, loading: true, error: "" };

        case "SUCCESS":
            return { ...state, loading: false, results: action.results };

        case "ERROR":
            return { ...state, loading: false, error: action.error };

        case "RESET":
            return initialState;

        case "DRAG":
            return { ...state, isDragging: action.value };

        case "COPIED":
            return { ...state, copied: action.value };

        default:
            return state;
    }
}

const Detection = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const fileInputRef = useRef(null);
    const resultsRef = useRef(null);

    const { file, preview, meta, isDragging, loading, results, error, copied } = state;

    const processFile = useCallback((f) => {
        if (!f || !f.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            dispatch({
                type: 'SET_FILE',
                file: f,
                meta: `${f.name} (${(f.size / 1024).toFixed(1)} KB)`,
                preview: e.target.result,
            });
        };
        reader.readAsDataURL(f);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'DRAG', value: false });
        if (e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'DRAG', value: true });
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: 'DRAG', value: false });
    }, []);

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDetection = async () => {
        if (!file) return;
        dispatch({ type: 'LOADING' });
        const startTime = performance.now();

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/detection/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

            if (response.data.status === 'success') {
                dispatch({
                    type: 'SUCCESS',
                    results: {
                        count: response.data.total_count,
                        time: `${elapsed}s`,
                        raw: response.data,
                    },
                });
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                dispatch({ type: 'ERROR', error: response.data.error || 'Detection failed' });
            }
        } catch (err) {
            dispatch({
                type: 'ERROR',
                error: err.response?.data?.message || err.response?.data?.error || 'Failed to run detection',
            });
        }
    };

    const handleCopyJson = async () => {
        if (!results) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(results.raw, null, 2));
            dispatch({ type: 'COPIED', value: true });
            setTimeout(() => dispatch({ type: 'COPIED', value: false }), 2000);
        } catch {
            dispatch({ type: 'ERROR', error: 'Failed to copy to clipboard' });
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[var(--page-bg)] transition-colors duration-300 py-12 px-4">
            {/* Helium-style Blob Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] animate-blob" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.24) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] animate-blob" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)', animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[35%] w-[450px] h-[450px] rounded-full blur-[100px] animate-blob" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', animationDelay: '4s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: BEZIER }}
                className="relative z-10 w-full max-w-3xl"
            >
                {/* Main Card */}
                <div className="glass rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
                    {/* Header */}
                    <div className="px-10 pt-10 pb-6" style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 20px rgba(124,58,237,0.35)' }}>
                                <ScanLine className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl italic tracking-tight" style={{ fontFamily: 'var(--font-headline)', color: 'var(--page-text)' }}>Document Analysis</h1>
                                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>FormLens AI Intelligence Engine</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 pt-6">
                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3"
                                >
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Drop Zone */}
                        <div
                            onClick={() => !preview && fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className="relative rounded-3xl border-2 border-dashed transition-all duration-500"
                            style={{
                                borderColor: preview
                                    ? 'transparent'
                                    : isDragging
                                        ? 'rgba(124,58,237,0.70)'
                                        : 'rgba(139,92,246,0.22)',
                                background: preview
                                    ? 'rgba(13,11,24,0.40)'
                                    : isDragging
                                        ? 'rgba(124,58,237,0.07)'
                                        : 'rgba(13,11,24,0.30)',
                                transform: isDragging ? 'scale(1.02)' : 'none',
                                cursor: preview ? 'default' : 'pointer'
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <AnimatePresence mode="wait">
                                {!preview ? (
                                    /* Upload Prompt */
                                    <motion.div
                                        key="prompt"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-20 px-6 text-center"
                                    >
                                        <div className="p-5 rounded-3xl mb-6" style={{ background: 'rgba(124,58,237,0.12)' }}>
                                            <Upload className="h-12 w-12" style={{ color: '#a78bfa' }} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-headline)', color: 'var(--page-text)' }}>
                                            Process New Document
                                        </h3>
                                        <p className="max-w-xs text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                                            Drag &amp; drop your files here or click to browse. Supports JPG and PNG.
                                        </p>
                                    </motion.div>
                                ) : (
                                    /* Preview */
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-6"
                                    >
                                        {/* Preview Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.15)' }}>
                                                    <FileImage className="h-5 w-5" style={{ color: '#a78bfa' }} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold" style={{ fontFamily: 'var(--font-headline)', color: 'var(--page-text)' }}>File Ready</span>
                                                    <span className="text-xs font-mono italic" style={{ color: 'var(--text-muted)' }}>
                                                        {meta}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Image */}
                                        <div className="relative group">
                                            <img
                                                src={preview}
                                                alt="Document Preview"
                                                className="w-full max-h-[450px] object-contain rounded-2xl border border-white/20 shadow-xl"
                                            />
                                            <div className="absolute inset-0 rounded-2xl bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                        {/* Run Detection Button */}
                                        <div className="flex justify-center mt-8">
                                            <motion.button
                                                onClick={(e) => { e.stopPropagation(); handleDetection(); }}
                                                disabled={loading}
                                                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(124,58,237,0.60)', transition: SPRING }}
                                                whileTap={{ scale: 0.97, transition: SPRING }}
                                                className="group relative px-10 py-4 rounded-2xl font-bold overflow-hidden disabled:opacity-50 text-white"
                                                style={{
                                                    fontFamily: 'var(--font-headline)',
                                                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                                    boxShadow: '0 0 30px rgba(124,58,237,0.40)'
                                                }}
                                            >
                                                <div className="relative flex items-center gap-3 z-10">
                                                    {loading ? (
                                                        <>
                                                            <motion.div
                                                                className="rounded-full h-5 w-5 border-b-2 border-white"
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                                            />
                                                            <span>Analyzing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ScanLine className="h-5 w-5" />
                                                            <span>Initiate Analysis</span>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Results Section */}
                        <AnimatePresence>
                            {results && (
                                <motion.div
                                    ref={resultsRef}
                                    initial={{ opacity: 0, y: 40, scale: 0.97, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: 20, scale: 0.97 }}
                                    transition={{ duration: 0.7, ease: BEZIER }}
                                    className="mt-10"
                                >
                                    <div className="glass rounded-[2rem] p-8 border border-white/20 shadow-2xl bg-white/10 dark:bg-black/20">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl italic" style={{ fontFamily: 'var(--font-headline)', color: 'var(--page-text)' }}>Intelligence Report</h2>
                                            <motion.button
                                                onClick={handleCopyJson}
                                                whileHover={{ scale: 1.1, rotate: 5, transition: SPRING }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-3 rounded-xl transition-all"
                                                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.18)', color: 'var(--text-muted)' }}
                                            >
                                                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
                                            </motion.button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            {[
                                                { label: 'Fields Detected', value: results.count, color: '#a78bfa' },
                                                { label: 'Latency', value: results.time, color: 'var(--page-text)' },
                                            ].map(({ label, value, color }, i) => (
                                                <motion.div
                                                    key={label}
                                                    className="glass rounded-2xl p-6 text-center"
                                                    style={{ border: '1px solid rgba(139,92,246,0.15)' }}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.15 + i * 0.1, ...SPRING }}
                                                    whileHover={{ scale: 1.04, transition: SPRING }}
                                                >
                                                    <div className="text-3xl mb-1" style={{ fontFamily: 'var(--font-headline)', color }}>{value}</div>
                                                    <div className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-headline)', color: 'var(--text-muted)' }}>{label}</div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <motion.div
                                            className="relative"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35, duration: 0.5, ease: BEZIER }}
                                        >
                                            <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 uppercase tracking-tighter opacity-50">Data Object</div>
                                            <pre className="bg-slate-900/90 text-teal-400 p-4 md:p-6 rounded-2xl text-[10px] md:text-xs overflow-x-auto max-h-[400px] font-mono border border-white/10 shadow-inner no-scrollbar">
                                                <code>{JSON.stringify(results.raw, null, 2)}</code>
                                            </pre>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Detection;
