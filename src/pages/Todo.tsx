import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Check, Trash2, ListTodo } from "lucide-react";
import { LiveBackground } from "@/components/LiveBackground";
import { FullscreenButton } from "@/components/FullscreenButton";

interface Task {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

const KEY = "prismic-todo-list";

const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks]);

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((t) => [{ id: Date.now().toString(), text, done: false, createdAt: Date.now() }, ...t]);
    setInput("");
  };

  const toggle = (id: string) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const remove = (id: string) => setTasks((t) => t.filter((x) => x.id !== id));

  const clearDone = () => setTasks((t) => t.filter((x) => !x.done));

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <LiveBackground variant="aurora" />

      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
        <Link to="/" className="glass rounded-full p-2.5 text-white hover:scale-110 transition-transform" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <FullscreenButton />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-5 pt-24 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl sm:text-5xl font-bold text-white mb-2"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
        >
          To-Do
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xs font-body tracking-[0.3em] uppercase mb-8"
        >
          {tasks.length > 0 ? `${doneCount} of ${tasks.length} done` : "what's the plan today"}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 w-full max-w-xl"
        >
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="Add a task..."
              className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 font-body focus:outline-none focus:border-white/50"
            />
            <button
              onClick={add}
              className="px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Add"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <button
                    onClick={() => toggle(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.done ? "bg-white/40 border-white/40" : "border-white/40 hover:border-white"
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span
                    className={`flex-1 text-sm font-body text-white break-words ${
                      task.done ? "line-through opacity-50" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => remove(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 transition-opacity text-white/70 hover:text-white"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {tasks.length === 0 && (
              <div className="text-center py-10 text-white/50 text-sm font-body flex flex-col items-center gap-2">
                <ListTodo className="w-6 h-6 opacity-60" />
                Your list is empty. Add your first task above.
              </div>
            )}
          </div>

          {doneCount > 0 && (
            <button
              onClick={clearDone}
              className="mt-4 text-white/60 hover:text-white text-xs font-body uppercase tracking-widest transition-colors"
            >
              Clear completed
            </button>
          )}
        </motion.div>

        <p className="text-white/50 text-[10px] mt-6 font-body tracking-[0.3em] uppercase">
          saved locally · works offline
        </p>
      </div>
    </div>
  );
};

export default Todo;
