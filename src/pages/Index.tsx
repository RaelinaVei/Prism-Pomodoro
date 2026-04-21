import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Maximize2, LogIn, LogOut, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { usePomodoro } from "@/hooks/usePomodoro";
import { useTheme } from "@/hooks/useTheme";
import { useStudyStats, StudyStatsWidget } from "@/components/StudyStats";
import { useCloudSync } from "@/hooks/useCloudSync";
import { useAuth } from "@/contexts/AuthContext";
import { TimerDisplay } from "@/components/TimerDisplay";
import { ModeSelector } from "@/components/ModeSelector";
import { TimerControls } from "@/components/TimerControls";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TodoTracker } from "@/components/TodoTracker";
import { SessionCounter } from "@/components/SessionCounter";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { QuickNotes } from "@/components/QuickNotes";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { stats, recordSession, setStats } = useStudyStats();
  const pomodoro = usePomodoro(recordSession);
  const themeCtx = useTheme();
  const cloudSync = useCloudSync();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const initialLoadDone = useRef(false);

  // Load cloud data on login
  useEffect(() => {
    if (user && !initialLoadDone.current) {
      initialLoadDone.current = true;
      cloudSync.loadUserData().then((data) => {
        if (!data) return;
        if (data.settings) {
          pomodoro.updateSettings({
            focusTime: data.settings.focusTime,
            shortBreakTime: data.settings.shortBreakTime,
            longBreakTime: data.settings.longBreakTime,
            sessionsBeforeLongBreak: data.settings.sessionsBeforeLongBreak,
          });
          themeCtx.setCurrentTheme(data.settings.theme);
          themeCtx.setIsDark(data.settings.isDark);
        }
        if (data.stats) {
          const today = new Date().toISOString().split("T")[0];
          const cloudStats = data.stats;
          // Reset today's counters if last study was a different day
          if (cloudStats.lastStudyDate !== today) {
            cloudStats.todayFocusMinutes = 0;
            cloudStats.todaySessions = 0;
          }
          setStats(cloudStats);
        }
      });
    }
    if (!user) {
      initialLoadDone.current = false;
    }
  }, [user]);

  // Auto-save settings to cloud
  const saveSettingsToCloud = useCallback(() => {
    if (user) {
      cloudSync.saveSettings(pomodoro.settings, themeCtx.currentTheme, themeCtx.isDark);
    }
  }, [user, pomodoro.settings, themeCtx.currentTheme, themeCtx.isDark, cloudSync]);

  // Save stats to cloud when they change
  useEffect(() => {
    if (user && stats.totalSessions > 0) {
      cloudSync.saveStats(stats);
    }
  }, [user, stats]);

  const progress = pomodoro.totalTime > 0 ? 1 - pomodoro.timeLeft / pomodoro.totalTime : 0;

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Update document title with timer
  useEffect(() => {
    document.title = `${pomodoro.display} — Prismic`;
    return () => { document.title = "Prismic — Aesthetic Pomodoro Timer"; };
  }, [pomodoro.display]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background: animated gradient OR image */}
      {themeCtx.currentTheme === "gradient" ? (
        <>
          <motion.div
            key="gradient-bg"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
            }}
            transition={{
              opacity: { duration: 0.8 },
              backgroundPosition: { duration: 24, repeat: Infinity, ease: "linear" },
            }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #1e1b4b, #4c1d95, #6d28d9, #db2777, #f97316, #1e1b4b)",
              backgroundSize: "400% 400%",
            }}
          />
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{
                width: 340 + i * 80,
                height: 340 + i * 80,
                background: `radial-gradient(circle, ${["#a855f7","#ec4899","#f59e0b"][i]}, transparent 70%)`,
                left: `${(i * 33) % 70}%`,
                top: `${(i * 41) % 60}%`,
              }}
              animate={{ x: [0, 80, -60, 0], y: [0, -70, 50, 0], scale: [1, 1.15, 0.9, 1] }}
              transition={{ duration: 18 + i * 3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </>
      ) : (
        <motion.img
          key={themeCtx.currentTheme}
          src={themeCtx.backgroundImage}
          alt="Theme background"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 theme-overlay" />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="glass rounded-full p-2.5 timer-text hover:scale-110 transition-transform"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-2xl font-bold timer-text tracking-wide"
          >
            prismic
          </motion.h1>
        </div>

        {user && (
          <span className="timer-text text-sm font-body opacity-80 hidden sm:block">
            {user.user_metadata?.display_name || user.email?.split("@")[0] || "Student"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 gap-5">
        {/* Mode selector */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <ModeSelector mode={pomodoro.mode} onSwitch={pomodoro.switchMode} />
        </motion.div>

        {/* Timer */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <TimerDisplay display={pomodoro.display} mode={pomodoro.mode} isRunning={pomodoro.isRunning} progress={progress} />
        </motion.div>

        {/* Session dots */}
        <SessionCounter
          completed={pomodoro.completedSessions % pomodoro.settings.sessionsBeforeLongBreak}
          total={pomodoro.settings.sessionsBeforeLongBreak}
        />

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <TimerControls
            isRunning={pomodoro.isRunning}
            onToggle={pomodoro.toggleTimer}
            onReset={pomodoro.resetTimer}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </motion.div>

        {/* Quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <MotivationalQuote />
        </motion.div>

        {/* Widgets row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 items-start"
        >
          <TodoTracker
            userId={user?.id}
            onSave={user ? cloudSync.saveTodos : undefined}
          />
          <div className="flex flex-col gap-3">
            <StudyStatsWidget stats={stats} />
            <QuickNotes
              userId={user?.id}
              onSave={user ? cloudSync.saveNotes : undefined}
            />
          </div>
        </motion.div>
      </div>

      {/* Spotify embed */}
      <SpotifyEmbed />

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="fixed bottom-4 right-4 z-20 glass rounded-full p-3 timer-text hover:scale-110 transition-transform"
        title="Fullscreen"
      >
        <Maximize2 className="w-5 h-5" />
      </button>

      {/* Settings */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          saveSettingsToCloud();
        }}
        settings={pomodoro.settings}
        onUpdateSettings={pomodoro.updateSettings}
        themes={themeCtx.themes}
        currentThemeId={themeCtx.currentTheme}
        onSelectTheme={themeCtx.setCurrentTheme}
        isDark={themeCtx.isDark}
        onToggleDark={() => themeCtx.setIsDark((p) => !p)}
        customBg={themeCtx.customBg}
        onCustomUpload={themeCtx.handleCustomUpload}
        onClearCustomBg={themeCtx.clearCustomBg}
      />

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Index;
