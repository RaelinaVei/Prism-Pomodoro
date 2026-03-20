import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  userId?: string;
  onSave?: (content: string) => void;
}

export function QuickNotes({ userId, onSave }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("pomodoro-notes") || "";
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (value: string) => {
    setNotes(value);
    localStorage.setItem("pomodoro-notes", value);
    if (onSave) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSave(value), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden w-80 max-w-full"
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-4 timer-text"
      >
        <div className="flex items-center gap-2 text-sm font-display font-medium">
          <StickyNote className="w-4 h-4" />
          Quick Notes
        </div>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <textarea
                value={notes}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Jot down quick notes, formulas, or reminders..."
                className="w-full h-32 bg-transparent border border-white/20 rounded-xl px-3 py-2 text-sm font-body timer-text placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-none"
              />
              <p className="timer-text text-[10px] font-body opacity-40 mt-1">
                {userId ? "☁️ Synced to cloud" : "Auto-saved locally"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
