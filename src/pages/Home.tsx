import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Timer, Hourglass, Clock, Flame, Wind, LogIn, LogOut, BarChart3, ListTodo, BookMarked } from "lucide-react";
import { LiveBackground } from "@/components/LiveBackground";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const tools = [
  { to: "/pomodoro", title: "Pomodoro", desc: "Focus sessions with aesthetic themes", icon: Flame },
  { to: "/flipclock", title: "Flip Clock", desc: "Minimal flip clock + custom timer", icon: Clock },
  { to: "/countdown", title: "Countdown", desc: "Set any duration & count down", icon: Hourglass },
  { to: "/stopwatch", title: "Stopwatch", desc: "Simple, precise timing", icon: Timer },
  { to: "/breathe", title: "Breathe", desc: "Calming box-breathing for focus", icon: Wind },
  { to: "/stats", title: "Stats", desc: "Streaks, history & total study time", icon: BarChart3 },
  { to: "/todo", title: "To-Do", desc: "Quick tasks, saved on this device", icon: ListTodo },
  { to: "/notes", title: "Notes", desc: "Subject library: teachers, key ideas & more", icon: BookMarked },
];

const greeting = (h: number) => {
  if (h < 5) return "still up?";
  if (h < 12) return "good morning";
  if (h < 17) return "good afternoon";
  if (h < 22) return "good evening";
  return "good night";
};

const Home = () => {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "friend";

  // Pre-compute floating particle positions
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 73) % 100}%`,
    delay: (i % 7) * 0.5,
    duration: 14 + (i % 5) * 3,
    size: 3 + (i % 4),
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <LiveBackground variant="aurora" />

      {/* Floating particles for ambience */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full bg-white/40 blur-[1px]"
            style={{ left: p.left, width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-full px-4 py-2 text-white/90 text-sm font-display tabular-nums tracking-wider hidden sm:block"
        >
          {timeStr}
        </motion.div>

        {user ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 ml-auto"
          >
            <span className="text-white/80 text-sm font-body hidden sm:block">{name}</span>
            <button
              onClick={() => signOut()}
              className="glass rounded-full p-2.5 text-white hover:scale-110 transition-transform"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setAuthOpen(true)}
            className="glass rounded-full px-4 py-2 text-white text-sm font-display font-medium flex items-center gap-2 hover:scale-105 transition-transform ml-auto"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </motion.button>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-24">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-xs sm:text-sm mb-3 font-body tracking-[0.3em] uppercase"
        >
          {greeting(now.getHours())}{user ? `, ${name}` : ""}
        </motion.p>

        {/* Animated title */}
        <motion.h1
          initial={{ opacity: 0, y: -30, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-white mb-3"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
        >
          prismic
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="h-px bg-white/60 mb-5"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-sm sm:text-base mb-12 font-body tracking-[0.3em] uppercase"
        >
          choose your flow
        </motion.p>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full max-w-4xl">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  to={tool.to}
                  className="glass group rounded-2xl p-5 sm:p-6 flex items-start gap-4 active:scale-[0.99] transition-transform block relative overflow-hidden h-full"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  <motion.div
                    className="rounded-xl bg-white/10 p-3 group-hover:bg-white/25 transition-colors"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-lg sm:text-xl font-semibold text-white mb-1">
                      {tool.title}
                    </h2>
                    <p className="text-white/70 text-xs sm:text-sm font-body">{tool.desc}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-white/50 text-xs mt-12 font-body tracking-[0.3em] uppercase"
        >
          stay focused · stay present
        </motion.p>
      </div>

      {/* Footer credit */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 pb-6 text-center"
      >
        <p className="text-white/40 text-[11px] font-body tracking-[0.25em] lowercase">
          made by <span className="text-white/70 font-medium">raelina_vei</span>
        </p>
      </motion.footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Home;
