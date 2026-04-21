import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Timer, Hourglass, Clock, Flame, Wind, LogIn, LogOut } from "lucide-react";
import { LiveBackground } from "@/components/LiveBackground";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const tools = [
  { to: "/pomodoro", title: "Pomodoro", desc: "Focus sessions with aesthetic themes", icon: Flame },
  { to: "/flipclock", title: "Flip Clock", desc: "Minimal clock + custom timer, with gradients", icon: Clock },
  { to: "/countdown", title: "Countdown", desc: "Set any duration & count down", icon: Hourglass },
  { to: "/stopwatch", title: "Stopwatch", desc: "Simple, precise timing", icon: Timer },
  { to: "/breathe", title: "Breathe", desc: "Calming box-breathing for focus", icon: Wind },
];

const Home = () => {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <LiveBackground variant="aurora" />

      {/* Top bar with auth */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-end px-5 py-4">
        {user ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <span className="text-white/80 text-sm font-body hidden sm:block">
              {user.user_metadata?.display_name || user.email?.split("@")[0] || "Student"}
            </span>
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
            className="glass rounded-full px-4 py-2 text-white text-sm font-display font-medium flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </motion.button>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-20">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1], duration: 0.6 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  to={tool.to}
                  className="glass group rounded-2xl p-6 sm:p-7 flex items-start gap-4 active:scale-[0.99] transition-transform block relative overflow-hidden"
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  <motion.div
                    className="rounded-xl bg-white/10 p-3 group-hover:bg-white/25 transition-colors"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-xl font-semibold text-white mb-1">
                      {tool.title}
                    </h2>
                    <p className="text-white/70 text-sm font-body">{tool.desc}</p>
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

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Home;
