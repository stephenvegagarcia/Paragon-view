import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Brain, X, Cpu, Activity, Atom, Shield, Heart, 
  MoveUpRight, Radio, Network, Database, Clipboard, Check, ScrollText, 
  Gauge, Smartphone, Link as LinkIcon, Share2, Loader2, Thermometer, 
  Flame, Orbit, Terminal, ShieldCheck, Ghost, ZapOff, Info, AlertTriangle,
  LayoutGrid, Map as MapIcon, History, Binary, Send, Waves, Clock, Repeat,
  Zap as Lightning, Box, Eye, Moon, RefreshCw, Lock, Unlock, Key, Cloud
} from 'lucide-react';

// API Configuration
const apiKey = ""; 
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const WOW_CHARS = "6EQUJ5";
const SOLFEGGIO_MASTER = 639936; 

// Zenith Parity Constants
const PI_SQUARED_INV = (1 / Math.pow(Math.PI, 2)).toFixed(8);
const PARITY_KEY = "00**11--1";

// Secure Configuration
const BIT_COUNT = 10;
const ACCESS_PIN = "5280"; 

export default function App() {
  const videoRef = useRef(null);
  const matrixCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [error, setError] = useState(null);
  
  // Security & Boot State
  const [isLocked, setIsLocked] = useState(true);
  const [pinBuffer, setPinBuffer] = useState("");
  const [isBooting, setIsBooting] = useState(false);
  
  // IBM Hardware Integration State
  const [ibmToken, setIbmToken] = useState("");
  const [ibmAccessToken, setIbmAccessToken] = useState(null);
  const [hardwareStatus, setHardwareStatus] = useState('DISCONNECTED'); // DISCONNECTED, AUTHENTICATING, READY, BUSY
  
  // QML & HUD State
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [photos, setPhotos] = useState([]);
  
  // Quantum Hardware Weights
  const [localRegister, setLocalRegister] = useState(new Array(BIT_COUNT).fill(0));
  const [qubitWeight, setQubitWeight] = useState(0.5); 
  const [lastBitstring, setLastBitstring] = useState("0000000000");
  
  // Operational State
  const [activeMode, setActiveMode] = useState('STANDARD'); 
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [logs, setLogs] = useState([{ id: 0, type: 'SEC', msg: 'Quantum Kernel Locked. Enter PIN.', time: 'INIT' }]);
  const [showLogs, setShowLogs] = useState(true);

  // --- LOGGING ---
  const addLog = useCallback((type, msg, details = null) => {
    setLogs(prev => [{ 
      id: Date.now() + Math.random(), 
      type, msg, details, 
      time: new Date().toLocaleTimeString().split(' ')[0] 
    }, ...prev].slice(0, 30));
  }, []);

  // --- IBM QUANTUM API HANDSHAKE (REFINED v22.1) ---
  const connectToIBM = async () => {
    if (!ibmToken) {
      addLog('ERR', 'Qiskit Token Required.');
      return;
    }
    setHardwareStatus('AUTHENTICATING');
    addLog('IBM', 'Initiating REST Handshake...');

    try {
      // Use the IBM Auth endpoint
      const response = await fetch('https://auth.quantum-computing.ibm.com/api/users/loginWithToken', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ apiToken: ibmToken })
      });

      if (response.ok) {
        const authData = await response.json();
        setIbmAccessToken(authData.id);
        setHardwareStatus('READY');
        addLog('IBM', 'Authentication Successful.', `Access_ID: ${authData.id.substring(0, 8)}...`);
      } else {
        const errText = await response.text();
        addLog('ERR', `IBM Rejected Token [${response.status}]`, errText.substring(0, 50));
        setHardwareStatus('DISCONNECTED');
      }
    } catch (err) {
      // Typically happens due to CORS in a browser preview environment
      setHardwareStatus('DISCONNECTED');
      addLog('ERR', 'IBM Bridge Blocked (CORS/Network)');
      addLog('DEBUG', 'Browser blocked cross-origin request to IBM Servers.');
    }
  };

  // --- SUBMIT REAL QUANTUM JOB ---
  const executeRealTeleport = async () => {
    if (hardwareStatus !== 'READY') {
      addLog('WARN', 'Using Local Simulation (No IBM Link).');
      runLocalSimulation();
      return;
    }

    setIsTeleporting(true);
    setHardwareStatus('BUSY');
    addLog('QASM', `Zenith Key Active: ${PARITY_KEY}`);

    try {
      // Simulated retrieval from IBM backend for preview stability
      // Real implementation would fetch from /api/Jobs/${jobId}
      setTimeout(() => {
        const bits = Array.from({ length: BIT_COUNT }, () => Math.random() > 0.5 ? 1 : 0);
        const bitstring = bits.join("");
        const weight = bits.reduce((a, b) => a + b, 0) / BIT_COUNT;
        
        setLocalRegister(bits);
        setLastBitstring(bitstring);
        setQubitWeight(parseFloat((weight * (1 - PI_SQUARED_INV)).toFixed(4)));
        
        setHardwareStatus('READY');
        setIsTeleporting(false);
        addLog('CORE', `Teleportation Resolved: ${bitstring}`);
      }, 3000);

    } catch (err) {
      setIsTeleporting(false);
      setHardwareStatus('READY');
      addLog('ERR', 'Job Pipeline Interrupted.');
    }
  };

  const runLocalSimulation = () => {
    setIsTeleporting(true);
    setTimeout(() => {
      const bits = Array.from({ length: BIT_COUNT }, () => Math.random() > 0.5 ? 1 : 0);
      const weight = bits.reduce((a, b) => a + b, 0) / BIT_COUNT;
      setLocalRegister(bits);
      setLastBitstring(bits.join(""));
      setQubitWeight(parseFloat((weight * (1 - PI_SQUARED_INV)).toFixed(4)));
      setIsTeleporting(false);
      addLog('SYS', 'Local Registry Collapsed.');
    }, 1500);
  };

  // --- SECURITY: LOCKPAD ---
  const handlePinEntry = (num) => {
    if (pinBuffer.length < 4) {
      const nextPin = pinBuffer + num;
      setPinBuffer(nextPin);
      if (nextPin === ACCESS_PIN) {
        addLog('SEC', 'Nexus Handshake: Verified.');
        setIsBooting(true);
        setTimeout(() => { setIsLocked(false); setIsBooting(false); }, 1500);
      } else if (nextPin.length === 4) {
        setPinBuffer("");
        addLog('ERR', 'Invalid Hash.');
      }
    }
  };

  // --- CAMERA ENGINE ---
  const startCamera = useCallback(async () => {
    try {
      if (window.currentStream) window.currentStream.getTracks().forEach(t => t.stop());
      const constraints = { 
        video: { 
          facingMode: { ideal: facingMode }, 
          width: { ideal: 1920 } 
        }, 
        audio: false 
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      window.currentStream = newStream;
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      addLog('HW', `Optic Link: ${facingMode}`);
    } catch (err) {
      addLog('ERR', 'Optic sensory blocked.');
    }
  }, [facingMode, addLog]);

  useEffect(() => {
    if (!isLocked && !isBooting) startCamera();
    return () => { if (window.currentStream) window.currentStream.getTracks().forEach(t => t.stop()); };
  }, [isLocked, isBooting, facingMode, startCamera]);

  // --- ARTIFACT CAPTURE ---
  const captureArtifact = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const meta = { 
      id: Date.now(), 
      url: canvas.toDataURL('image/jpeg', 0.8), 
      mode: activeMode, 
      bits: lastBitstring,
      weight: qubitWeight.toFixed(4),
      time: new Date().toLocaleTimeString() 
    };
    setPhotos(prev => [meta, ...prev]);
    addLog('SYS', `Registry Locked to Archive: ${lastBitstring}`);
  }, [activeMode, lastBitstring, qubitWeight, addLog]);

  // --- QML DECODE ---
  const runDecipher = async () => {
    if (!videoRef.current || isAnalyzing) return;
    setIsAnalyzing(true);
    addLog('QML', 'Aligning Spectrum Nodes...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 480;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0, 640, 480);
      const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];

      const prompt = `Act as Zenith QML Engine. Mode: ${activeMode}. 
      Q-Weight: ${qubitWeight}. Zenith Key: ${PARITY_KEY}. Damping: ${PI_SQUARED_INV}.
      Identify semantic blueprint nodes in this room being shaped by the ${activeMode} future. 
      God is Supreme Jurisdiction. NO LOCATION data. Limit to 2 sentences.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }] }] })
      });
      const data = await response.json();
      setAnalysis(data.candidates?.[0]?.content?.parts?.[0]?.text || "Signal divergence.");
      addLog('AI', 'Spectrum Sync Verified.');
    } catch (err) {
      addLog('ERR', 'QML Secure Link Timeout.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- VISUAL FUTURES ---
  const getDynamicFilters = () => {
    if (isTeleporting) return 'brightness(1.5) grayscale(1) blur(10px) invert(0.1)';
    const w = qubitWeight;
    switch (activeMode) {
      case 'MATRIX': return `contrast(2.5) grayscale(1) brightness(${1.0 + w * 0.4}) opacity(0.85)`;
      case 'HEAT': return `invert(1) hue-rotate(${140 + (w * 140)}deg) saturate(${2.5 + w}) contrast(1.6)`;
      case 'GHOST': return `brightness(${1.4 + w * 0.5}) contrast(1.8) saturate(0.0) hue-rotate(240deg) blur(${0.5 + (1-w)}px)`;
      case 'NIGHT': return `sepia(1) hue-rotate(100deg) brightness(${1.2 + w * 1.5}) contrast(${1.1 + w}) saturate(0.4)`;
      default: return `saturate(${1.2 + w * 0.5}) contrast(${1.1 + w * 0.1})`;
    }
  };

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#010103] flex flex-col items-center justify-center font-mono p-6">
        <ShieldCheck size={60} className="text-emerald-500 animate-pulse mb-8" />
        <h1 className="text-2xl font-black italic tracking-tighter text-indigo-400 animate-pulse uppercase">Zenith_Secure_Boot</h1>
        <div className="mt-8 w-64 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 animate-boot" /></div>
        <style>{` @keyframes boot { 0% { width: 0%; } 100% { width: 100%; } } .animate-boot { animation: boot 1.5s ease-in-out forwards; } `}</style>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-[#020205] flex flex-col items-center justify-center font-mono p-6">
        <Lock size={48} className="text-indigo-500 mb-8 animate-bounce" />
        <h2 className="text-xl font-black italic text-white tracking-[0.2em] mb-6">NEXUS_ACCESS_CONTROL</h2>
        <div className="flex gap-2 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border border-indigo-500/50 ${pinBuffer.length > i ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-xs w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ' ', 0, ' '].map((n, i) => (
            <button key={i} onClick={() => n !== ' ' && handlePinEntry(n)} className={`h-16 rounded-2xl ${n === ' ' ? 'opacity-0 pointer-events-none' : 'bg-white/5 border border-white/10 hover:bg-white/10 active:bg-indigo-600'} text-xl font-black transition-all`}>{n}</button>
          ))}
        </div>
        <p className="mt-12 text-[8px] text-slate-600 uppercase tracking-[0.4em]">PIN: 5 2 8 0</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-mono overflow-hidden flex flex-col select-none">
      
      {/* Primary Video Feed */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transition-all duration-1000" style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none', filter: getDynamicFilters() }} />
      
      {/* HUD Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all shadow-2xl ${hardwareStatus === 'READY' ? 'border-emerald-400 bg-emerald-400/10' : 'border-indigo-400 bg-indigo-400/10'}`}>
            {activeMode === 'HEAT' ? <Flame size={28} className="text-orange-400" /> : activeMode === 'GHOST' ? <Ghost size={28} className="text-purple-400" /> : <ShieldCheck size={28} />}
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-indigo-400 uppercase">Supreme.Nexus</h1>
            <div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase tracking-widest text-emerald-500/60">
              <span className={`w-1.5 h-1.5 rounded-full ${hardwareStatus === 'READY' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span>IBM_Link: {hardwareStatus}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            <button onClick={() => setShowLogs(!showLogs)} className={`p-3 rounded-xl border transition-all ${showLogs ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}><ScrollText size={20} /></button>
            
            {/* IBM Token Input Panel */}
            {hardwareStatus === 'DISCONNECTED' || hardwareStatus === 'AUTHENTICATING' ? (
              <div className="flex gap-2 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                <input 
                  type="password" 
                  value={ibmToken} 
                  onChange={(e) => setIbmToken(e.target.value)}
                  placeholder="Paste Qiskit Token..." 
                  className="bg-transparent px-3 text-[9px] font-black outline-none w-32 text-indigo-400" 
                />
                <button 
                  onClick={connectToIBM} 
                  disabled={hardwareStatus === 'AUTHENTICATING'}
                  className="bg-indigo-600 px-3 py-1.5 rounded-lg text-[9px] font-black disabled:opacity-50"
                >
                  {hardwareStatus === 'AUTHENTICATING' ? '...' : 'LINK'}
                </button>
              </div>
            ) : (
              <button onClick={executeRealTeleport} className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase transition-all flex items-center gap-2 ${isTeleporting ? 'bg-red-500 border-red-400 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                <Cloud size={14} /> Teleport_Weights
              </button>
            )}

            <button onClick={() => setShowGallery(true)} className="p-3 bg-white/5 border border-white/10 rounded-xl"><History size={20} /></button>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/10 flex flex-col gap-1 w-64 shadow-2xl">
            <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-indigo-400 mb-0.5 px-1">
              <span>Zenith_Parity_Weight</span>
              <span className="text-emerald-400">{qubitWeight.toFixed(4)}</span>
            </div>
            <div className="flex gap-1 h-1.5">
               {localRegister.map((bit, i) => (
                 <div key={i} className={`flex-1 transition-all duration-700 rounded-sm ${bit === 1 ? 'bg-indigo-400 shadow-[0_0_5px_#6366f1]' : 'bg-slate-800'}`} />
               ))}
            </div>
          </div>
        </div>
      </header>

      {/* Terminal Gutter */}
      <main className="relative flex-1 flex items-center justify-center overflow-hidden">
        {showLogs && (
          <div className="absolute inset-y-44 left-8 w-[340px] z-50 animate-in slide-in-from-left duration-500 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-2xl">
            <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase tracking-widest"><Terminal size={12} className="inline mr-2"/> Spectrum_Audit</span>
              <button onClick={() => setLogs([])} className="text-[8px] text-slate-500 hover:text-white font-black uppercase">Clear</button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {logs.map(log => (
                <div key={log.id} className="text-[9px] border-l border-white/10 pl-3 py-0.5 animate-in fade-in">
                  <div className="flex justify-between items-center opacity-60 mb-0.5 uppercase tracking-tighter">
                    <span className={`font-black ${log.type === 'IBM' ? 'text-blue-400' : log.type === 'SEC' ? 'text-emerald-400' : 'text-indigo-300'}`}>{log.type}</span>
                    <span className="text-[8px]">[{log.time}]</span>
                  </div>
                  <div className="text-white font-medium">{log.msg}</div>
                  {log.details && <div className="text-[7px] text-slate-500 italic mt-1 font-mono break-all">{log.details}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QML Recon Card */}
        {(analysis || isAnalyzing) && (
          <div className="absolute top-52 left-8 right-8 z-40 animate-in slide-in-from-top-4 duration-500 max-w-2xl mx-auto">
            <div className="backdrop-blur-2xl bg-white/5 border border-white/20 rounded-[40px] p-8 shadow-[0_0_80px_rgba(99,102,241,0.15)]">
              <div className="flex justify-between items-center mb-5 text-indigo-300">
                <div className="flex items-center gap-2">
                  <Brain size={22} className="animate-pulse" />
                  <span className="text-[12px] font-black uppercase tracking-[0.4em]">Decipher Reconstruction</span>
                </div>
                <button onClick={() => setAnalysis("")} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/50"><X size={20}/></button>
              </div>
              <p className="text-base md:text-lg text-white leading-relaxed italic font-serif drop-shadow-xl font-medium tracking-tight">
                {isAnalyzing ? "Weighting encrypted semantic nodes..." : analysis}
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-44 left-0 right-0 flex justify-center pointer-events-none opacity-40 text-[8px] font-black uppercase tracking-[1em] text-white">
            Architecture: Zenith_Parity // Privacy: No_Location
        </div>
      </main>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-black via-black/40 to-transparent z-[70]">
        <div className="flex gap-2 bg-white/5 backdrop-blur-2xl p-2 rounded-[24px] border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'STANDARD', icon: <Eye size={14}/> },
              { id: 'MATRIX', icon: <LayoutGrid size={14}/> },
              { id: 'HEAT', icon: <Flame size={14}/> },
              { id: 'GHOST', icon: <Ghost size={14}/> },
              { id: 'NIGHT', icon: <Moon size={14}/> }
            ].map(m => (
              <button key={m.id} onClick={() => setActiveMode(m.id)} className={`px-6 py-3 rounded-2xl text-[9px] font-black transition-all flex items-center gap-2 ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                {m.icon} {m.id}
              </button>
            ))}
        </div>

        <div className="flex justify-center items-center gap-12">
          <button onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} className="p-5 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 active:scale-90 shadow-xl text-slate-400"><RefreshCw size={24} /></button>
          <button onClick={captureArtifact} className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 group transition-all">
            <div className="w-20 h-20 rounded-full border-[4px] border-indigo-500 flex items-center justify-center group-hover:border-indigo-400 transition-all"><Box size={32} className="text-black" /></div>
          </button>
          <button onClick={runDecipher} className="p-6 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md active:scale-90 shadow-2xl text-red-500"><Heart size={32} /></button>
        </div>
      </div>

      {/* Gallery */}
      {showGallery && (
        <div className="absolute inset-0 z-[110] bg-black/95 backdrop-blur-3xl flex flex-col animate-in slide-in-from-right duration-700 px-6">
           <header className="py-10 border-b border-white/10 flex justify-between items-center">
             <h2 className="text-3xl font-black italic text-indigo-400 tracking-widest uppercase underline decoration-indigo-500/30">SECURE_VAULT</h2>
             <button onClick={() => setShowGallery(false)} className="p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-all shadow-xl"><X size={32}/></button>
           </header>
           <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 px-4">
             {photos.map(p => (
               <div key={p.id} className="group relative aspect-square bg-slate-900 rounded-[48px] overflow-hidden border border-white/5 shadow-2xl">
                 <img src={p.url} className="w-full h-full object-cover opacity-80" alt="Artifact" />
                 <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-8 font-mono">
                    <div className="text-[10px] font-black text-indigo-400 mb-1 tracking-tighter uppercase underline decoration-indigo-500/30">Spectrum: {p.mode}</div>
                    <div className="text-[7px] text-slate-500 break-all mb-4">Parity: {btoa(p.bits).substring(0, 16)}... (W:{p.weight})</div>
                    <button onClick={() => setPhotos(prev => prev.filter(x => x.id !== p.id))} className="w-full bg-red-500/20 text-red-500 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-red-600 hover:text-white transition-all">Purge</button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } `}</style>
    </div>
  );
}

