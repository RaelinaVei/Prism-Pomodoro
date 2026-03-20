import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Clock, Flame, ChevronDown, ChevronUp, Trophy } from "lucide-react";

export interface StudyStats {
  totalFocusMinutes: number;
  totalSessions: number;
  todayFocusMinutes: number;
  todaySessions: number;
  streak: number;
  lastStudyDate: string;
}

const getDefaultStats = (): StudyStats => ({
  totalFocusMinutes: 0,
  totalSessions: 0,
  todayFocusMinutes: 0,
  todaySessions: 0,
  streak: 0,
  lastStudyDate: "",
});

const getToday = () => new Date().toISOString().split("T")[0];

export function useStudyStats() {
  const [stats, setStats] = useState<StudyStats>(() => {
    const saved = localStorage.getItem("pomodoro-stats");
    if (!saved) return getDefaultStats();
    const parsed = JSON.parse(saved) as StudyStats;
    const today = getToday();
    if (parsed.lastStudyDate !== today) {
      return { ...parsed, todayFocusMinutes: 0, todaySessions: 0 };
    }
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem("pomodoro-stats", JSON.stringify(stats));
  }, [stats]);

  const recordSession = (focusMinutes: number) => {
    const today = getToday();
    setStats((prev) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newStreak = prev.streak;
      if (prev.lastStudyDate === yesterdayStr || prev.lastStudyDate === today) {
        if (prev.lastStudyDate !== today) newStreak += 1;
      } else if (prev.lastStudyDate !== today) {
        newStreak = 1;
      }

      return {
        totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
        totalSessions: prev.totalSessions + 1,
        todayFocusMinutes: prev.todayFocusMinutes + focusMinutes,
        todaySessions: prev.todaySessions + 1,
        streak: newStreak,
        lastStudyDate: today,
      };
    });
  };

  return { stats, recordSession, setStats };
}

export function StudyStatsWidget({ stats }: { stats: StudyStats }) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
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
          <BarChart3 className="w-4 h-4" />
          Study Stats
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
            <div className="px-4 pb-4 grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <Clock className="w-4 h-4 timer-text opacity-60 mx-auto mb-1" />
                <p className="timer-text text-lg font-display font-semibold">{formatTime(stats.todayFocusMinutes)}</p>
                <p className="timer-text text-[10px] font-body opacity-60">Today</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <Trophy className="w-4 h-4 timer-text opacity-60 mx-auto mb-1" />
                <p className="timer-text text-lg font-display font-semibold">{stats.todaySessions}</p>
                <p className="timer-text text-[10px] font-body opacity-60">Sessions Today</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <Flame className="w-4 h-4 timer-text opacity-60 mx-auto mb-1" />
                <p className="timer-text text-lg font-display font-semibold">{stats.streak} 🔥</p>
                <p className="timer-text text-[10px] font-body opacity-60">Day Streak</p>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <BarChart3 className="w-4 h-4 timer-text opacity-60 mx-auto mb-1" />
                <p className="timer-text text-lg font-display font-semibold">{formatTime(stats.totalFocusMinutes)}</p>
                <p className="timer-text text-[10px] font-body opacity-60">All Time</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
