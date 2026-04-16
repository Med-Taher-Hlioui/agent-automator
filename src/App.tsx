import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Circle, Send, Terminal, Trash2, Zap } from 'lucide-react';
import { planTask } from './lib/agent';

interface Step {
  step: number;
  task: string;
  status: 'pending' | 'completed';
}

function App() {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRunAgent = async () => {
    if (!input || loading) return;
    setLoading(true);
    setSteps([]);
    
    try {
      const result = await planTask(input);
      setSteps(result);
    } catch (error: any) {
      alert(error.message || "An error occurred. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSteps([]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 text-center pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4"
          >
            <Terminal size={14} />
            <span>SYSTEM READY: GEMINI-3.1-FLASH</span>
          </motion.div>
          
          <h1 className="text-6xl font-black bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent mb-4 tracking-tighter">
            Agentic.
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Turn complex visions into step-by-step reality.
          </p>
        </header>

        {/* Action Bar */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-2 rounded-2xl flex gap-2 mb-10 shadow-2xl focus-within:ring-2 ring-blue-500/20 transition-all backdrop-blur-xl">
          <input 
            className="flex-1 bg-transparent border-none rounded-lg px-4 py-3 focus:outline-none text-white placeholder:text-slate-700 font-medium"
            placeholder="Describe your goal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunAgent()}
          />
          
          <div className="flex gap-2">
            {steps.length > 0 && (
              <button 
                onClick={handleClear}
                className="bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 p-3 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-500/20"
                title="Clear"
              >
                <Trash2 size={20} />
              </button>
            )}
            
            <button 
              onClick={handleRunAgent}
              disabled={loading || !input}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-blue-900/20 text-white"
            >
              {loading ? (
                <Zap size={18} className="animate-spin" />
              ) : (
                <><Send size={18} /> Run Agent</>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-slate-900/60 border border-slate-800/50 p-6 rounded-2xl flex items-start gap-5 hover:bg-slate-900/80 hover:border-blue-500/20 transition-all cursor-default"
              >
                <div className="mt-1 text-blue-500">
                  <CheckCircle2 size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 mb-1 block">
                    Phase {step.step}
                  </span>
                  <p className="text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {step.task}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Welcome State */}
          {!loading && steps.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-dashed border-slate-900 rounded-3xl bg-slate-900/10"
            >
              <Sparkles className="text-slate-800 mx-auto mb-4" size={40} />
              <p className="text-slate-600 font-medium">Enter a mission to begin execution.</p>
            </motion.div>
          )}
        </div>

        <footer className="mt-24 text-center pb-12">
          <p className="text-slate-700 text-xs font-mono uppercase tracking-widest">
            Production Build 1.0.4 • April 2026
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;