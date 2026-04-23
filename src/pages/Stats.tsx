import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Clock, Trophy, BarChart3, CalendarDays } from "lucide-react";
import { LiveBackground } from "@/components/LiveBackground";
import { FullscreenButton } from "@/components/FullscreenButton";
import { getStats } from "@/lib/studyTracker";

const formatMin = (m: number) => {
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
};

const dayLabel = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { weekday: "short" });
};

const Stats = () => {
  const [data, setData] = useState(() => getStats());

  useEffect(() => {
    const refresh = () => setData(getStats());
    window.addEventListener("prismic-study-update", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("prismic-study-update", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const max = Math.max(1, ...data.last7.map((d) => d.minutes));

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
          Your Stats
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xs font-body tracking-[0.3em] uppercase mb-10"
        >
          keep the streak alive
        </motion.p>

        {/* Top metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mb-8">
          {[
            { Icon: Flame, label: "Streak", value: `${data.streak}🔥`, delay: 0.1 },
            { Icon: Clock, label: "Today", value: formatMin(data.todayMinutes), delay: 0.2 },
            { Icon: Trophy, label: "Sessions", value: `${data.totalSessions}`, delay: 0.3 },
            { Icon: BarChart3, label: "All Time", value: formatMin(data.totalMinutes), delay: 0.4 },
          ].map(({ Icon, label, value, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              className="glass rounded-2xl p-4 flex flex-col items-center text-center"
            >
              <Icon className="w-5 h-5 text-white/70 mb-2" />
              <p className="font-display text-xl sm:text-2xl font-semibold text-white">{value}</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* 7-day chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 w-full max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-5 text-white">
            <CalendarDays className="w-4 h-4" />
            <h2 className="font-display text-sm font-medium tracking-wider uppercase">Last 7 days</h2>
          </div>

          <div className="flex items-end justify-between gap-2 h-44">
            {data.last7.map((d, i) => {
              const pct = (d.minutes / max) * 100;
              const isToday = i === data.last7.length - 1;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-white/80 text-[10px] font-body h-4">
                    {d.minutes > 0 ? formatMin(d.minutes) : ""}
                  </div>
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-full rounded-lg ${
                        isToday
                          ? "bg-gradient-to-t from-pink-400/80 to-purple-400/80"
                          : "bg-white/30"
                      }`}
                      style={{ minHeight: d.minutes > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <div className={`text-[10px] uppercase tracking-wider ${isToday ? "text-white font-semibold" : "text-white/60"}`}>
                    {dayLabel(d.date)}
                  </div>
                </div>
              );
            })}
          </div>

          {data.totalMinutes === 0 && (
            <p className="text-white/60 text-sm font-body text-center mt-6">
              Start a focus session to see your history here ✨
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
