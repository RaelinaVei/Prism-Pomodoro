import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { PomodoroSettings } from "@/hooks/usePomodoro";

interface UserData {
  settings: PomodoroSettings & { theme: string; isDark: boolean };
  todos: Array<{ id: string; text: string; done: boolean }>;
  stats: {
    totalFocusMinutes: number;
    totalSessions: number;
    todayFocusMinutes: number;
    todaySessions: number;
    streak: number;
    lastStudyDate: string;
  };
  notes: string;
}

export function useCloudSync() {
  const { user } = useAuth();
  const syncingRef = useRef(false);

  const loadUserData = useCallback(async (): Promise<Partial<UserData> | null> => {
    if (!user) return null;

    const [settingsRes, todosRes, statsRes, notesRes] = await Promise.all([
      supabase.from("user_settings").select("*").eq("user_id", user.id).single(),
      supabase.from("user_todos").select("*").eq("user_id", user.id).order("position"),
      supabase.from("user_stats").select("*").eq("user_id", user.id).single(),
      supabase.from("user_notes").select("*").eq("user_id", user.id).single(),
    ]);

    const data: Partial<UserData> = {};

    if (settingsRes.data) {
      data.settings = {
        focusTime: settingsRes.data.focus_time,
        shortBreakTime: settingsRes.data.short_break_time,
        longBreakTime: settingsRes.data.long_break_time,
        sessionsBeforeLongBreak: settingsRes.data.sessions_before_long_break,
        theme: settingsRes.data.theme,
        isDark: settingsRes.data.is_dark,
      };
    }

    if (todosRes.data) {
      data.todos = todosRes.data.map((t) => ({ id: t.id, text: t.text, done: t.done }));
    }

    if (statsRes.data) {
      data.stats = {
        totalFocusMinutes: statsRes.data.total_focus_minutes,
        totalSessions: statsRes.data.total_sessions,
        todayFocusMinutes: statsRes.data.today_focus_minutes,
        todaySessions: statsRes.data.today_sessions,
        streak: statsRes.data.streak,
        lastStudyDate: statsRes.data.last_study_date || "",
      };
    }

    if (notesRes.data) {
      data.notes = notesRes.data.content;
    }

    return data;
  }, [user]);

  const saveSettings = useCallback(async (settings: PomodoroSettings, theme: string, isDark: boolean) => {
    if (!user || syncingRef.current) return;
    syncingRef.current = true;
    await supabase.from("user_settings").update({
      focus_time: settings.focusTime,
      short_break_time: settings.shortBreakTime,
      long_break_time: settings.longBreakTime,
      sessions_before_long_break: settings.sessionsBeforeLongBreak,
      theme,
      is_dark: isDark,
    }).eq("user_id", user.id);
    syncingRef.current = false;
  }, [user]);

  const saveTodos = useCallback(async (todos: Array<{ id: string; text: string; done: boolean }>) => {
    if (!user) return;
    // Delete existing and re-insert
    await supabase.from("user_todos").delete().eq("user_id", user.id);
    if (todos.length > 0) {
      await supabase.from("user_todos").insert(
        todos.map((t, i) => ({
          user_id: user.id,
          text: t.text,
          done: t.done,
          position: i,
        }))
      );
    }
  }, [user]);

  const saveStats = useCallback(async (stats: UserData["stats"]) => {
    if (!user) return;
    await supabase.from("user_stats").update({
      total_focus_minutes: stats.totalFocusMinutes,
      total_sessions: stats.totalSessions,
      today_focus_minutes: stats.todayFocusMinutes,
      today_sessions: stats.todaySessions,
      streak: stats.streak,
      last_study_date: stats.lastStudyDate || null,
    }).eq("user_id", user.id);
  }, [user]);

  const saveNotes = useCallback(async (content: string) => {
    if (!user) return;
    await supabase.from("user_notes").update({ content }).eq("user_id", user.id);
  }, [user]);

  return { loadUserData, saveSettings, saveTodos, saveStats, saveNotes, isLoggedIn: !!user };
}
