import { useMemo, useState, useCallback } from "react";
import { ReactFlowProvider, ReactFlow, applyEdgeChanges, applyNodeChanges, addEdge, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate } from "react-router-dom";
import CustomNode from "../src/nodes/CustomNode";
import { ArrowLeft, Plus, Save, Trash2, X, Workflow } from "lucide-react";

const hl = { fontFamily: 'var(--font-headline)' };
const bd = { fontFamily: 'var(--font-body)' };

const WorkflowManagement = () => {
    const navigate = useNavigate();
    const initialNode = [
        {
            id: "1",
            position: { x: 100, y: 100 },
            data: { label: "Start", isStart: true },
            draggable: false,
            selectable: false,
        },
    ];
    const initialEdges = [{ id: "1-2", source: "1", target: null }];

    const [nodes, setNodes] = useState(initialNode);
    const [edges, setEdges] = useState(initialEdges);
    const [AgentName, setAgentName] = useState('');
    const [Description, setDescription] = useState('');
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((edge) => setEdges((eds) => addEdge(edge, eds)), []);
    const onEdgeClick = useCallback((event, edge) => setEdges((eds) => eds.filter((e) => e.id !== edge.id)), []);

    const onNodeClick = useCallback((event, node) => {
        if (node.data.isStart) return;
        setSelectedNodeId(node.id);
        setAgentName(node.data.AgentName || '');
        setDescription(node.data.Description || '');
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
        setAgentName('');
        setDescription('');
    }, []);

    const addOrUpdateNode = () => {
        if (selectedNodeId) {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === selectedNodeId
                        ? { ...node, data: { ...node.data, AgentName, Description } }
                        : node
                )
            );
            setSelectedNodeId(null);
            setAgentName('');
            setDescription('');
        } else {
            const id = Math.random().toString();
            setNodes((nds) => nds.concat({
                id,
                type: 'custom',
                position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
                data: { AgentName, Description },
            }));
            setAgentName('');
            setDescription('');
        }
    };

    const deleteNode = () => {
        if (!selectedNodeId) return;
        setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
        setSelectedNodeId(null);
        setAgentName('');
        setDescription('');
    };

    const onSave = () => {
        console.log("Saving Flow:", { nodes, edges });
        alert("Flow saved to console!");
    };

    const inputStyle = {
        background: 'rgba(124,58,237,0.06)',
        border: '1px solid rgba(139,92,246,0.22)',
        color: 'white',
        borderRadius: '12px',
        padding: '10px 14px',
        outline: 'none',
        width: '100%',
        fontSize: '14px',
        transition: 'border-color 0.2s',
        ...bd,
    };

    return (
        <div
            className="flex flex-col lg:flex-row-reverse min-h-screen w-full"
            style={{ background: 'var(--page-bg, #05020f)' }}
        >
            {/* ── Sidebar ── */}
            <div
                className="w-full lg:w-[360px] flex flex-col p-6 z-10"
                style={{
                    background: 'rgba(13,11,24,0.85)',
                    borderLeft: '1px solid rgba(139,92,246,0.15)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Back */}
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 w-fit text-sm font-semibold mb-8 px-3 py-2 rounded-xl transition-all hover:-translate-x-1"
                    style={{ color: '#a78bfa', background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(139,92,246,0.18)', ...bd }}
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>

                {/* Title */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 18px rgba(124,58,237,0.40)' }}>
                        <Workflow size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white" style={hl}>Workflow Editor</h2>
                        <p className="text-xs" style={{ ...bd, color: 'var(--text-muted)' }}>Design your agent pipeline</p>
                    </div>
                </div>

                {/* Node Form */}
                <div
                    className="rounded-2xl p-5 flex flex-col gap-4 mb-6"
                    style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ ...bd, color: 'var(--text-muted)' }}>
                            {selectedNodeId ? 'Edit Node' : 'Add Node'}
                        </span>
                        {selectedNodeId && (
                            <button onClick={onPaneClick} style={{ color: 'var(--text-muted)' }} className="hover:text-red-400 transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ ...bd, color: 'var(--text-muted)' }}>Agent Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Validation Agent"
                            value={AgentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)'}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold" style={{ ...bd, color: 'var(--text-muted)' }}>Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Verifying extracted fields"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={inputStyle}
                            onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)'}
                        />
                    </div>

                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={addOrUpdateNode}
                            disabled={!AgentName || !Description}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                background: selectedNodeId
                                    ? 'linear-gradient(135deg, #d97706, #b45309)'
                                    : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                boxShadow: selectedNodeId
                                    ? '0 0 16px rgba(217,119,6,0.30)'
                                    : '0 0 16px rgba(124,58,237,0.30)',
                                ...bd,
                            }}
                        >
                            {selectedNodeId ? <Save size={15} /> : <Plus size={15} />}
                            {selectedNodeId ? 'Update' : 'Add Node'}
                        </button>

                        {selectedNodeId && (
                            <button
                                onClick={deleteNode}
                                className="p-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                                style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171' }}
                                title="Delete Node"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Save */}
                <div className="mt-auto flex flex-col gap-4">
                    <button
                        onClick={onSave}
                        disabled={!edges.some(e => e.source && e.target)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                            boxShadow: '0 0 20px rgba(124,58,237,0.35)',
                            ...bd,
                        }}
                    >
                        <Save size={15} />
                        Save Workflow
                    </button>

                    <div
                        className="p-4 rounded-xl text-xs leading-relaxed"
                        style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.15)', color: '#c4b5fd', ...bd }}
                    >
                        <strong>Tip:</strong> Click a node to edit or delete it. Click on the canvas to deselect.
                    </div>
                </div>
            </div>

            {/* ── Canvas ── */}
            <div className="flex-1 h-[55vh] lg:h-auto relative">
                <div className="w-full h-full min-h-[560px]">
                    <ReactFlowProvider>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            onPaneClick={onPaneClick}
                            fitView
                            style={{ background: '#05020f' }}
                        >
                            <Background variant="dots" gap={16} size={1} color="rgba(139,92,246,0.20)" />
                            <Controls style={{ background: 'rgba(13,11,24,0.80)', border: '1px solid rgba(139,92,246,0.20)', borderRadius: '12px' }} />
                            <MiniMap
                                style={{ background: 'rgba(13,11,24,0.80)', border: '1px solid rgba(139,92,246,0.20)', borderRadius: '12px', height: 90, width: 150 }}
                                zoomable pannable
                            />
                        </ReactFlow>
                    </ReactFlowProvider>
                </div>
            </div>
        </div>
    );
};

export default WorkflowManagement;
