import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Timer, Hourglass, Clock, Flame } from "lucide-react";
import { LiveBackground } from "@/components/LiveBackground";

const tools = [
  {
    to: "/pomodoro",
    title: "Pomodoro",
    desc: "Focus sessions with aesthetic themes",
    icon: Flame,
  },
  {
    to: "/flipclock",
    title: "Flip Clock",
    desc: "Minimal flipping clock, black & white",
    icon: Clock,
  },
  {
    to: "/countdown",
    title: "Countdown",
    desc: "Set any duration and count down",
    icon: Hourglass,
  },
  {
    to: "/stopwatch",
    title: "Stopwatch",
    desc: "Simple, precise timer",
    icon: Timer,
  },
];

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <LiveBackground variant="aurora" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl sm:text-7xl font-bold text-white tracking-wide mb-3"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
        >
          prismic
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-sm sm:text-base mb-12 font-body tracking-wide"
        >
          choose your flow
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-3xl">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <Link
                  to={tool.to}
                  className="glass group rounded-2xl p-6 sm:p-7 flex items-start gap-4 hover:scale-[1.02] active:scale-[0.99] transition-transform block"
                >
                  <div className="rounded-xl bg-white/10 p-3 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
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
          transition={{ delay: 0.8 }}
          className="text-white/50 text-xs mt-12 font-body"
        >
          stay focused · stay present
        </motion.p>
      </div>
    </div>
  );
};

export default Home;
