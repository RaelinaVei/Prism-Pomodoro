import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Palette } from "lucide-react";
import { FlipDigit } from "@/components/FlipDigit";

const pad = (n: number) => n.toString().padStart(2, "0");

type BgMode = "dark" | "light" | "aurora" | "sunset" | "ocean" | "rose" | "mint";

const gradients: Record<Exclude<BgMode, "dark" | "light">, string> = {
  aurora: "linear-gradient(135deg, #0f172a, #1e1b4b, #312e81, #0f766e)",
  sunset: "linear-gradient(135deg, #1a1033, #4a1a4a, #7a2d4a, #c2410c)",
  ocean: "linear-gradient(135deg, #020617, #0c4a6e, #155e75, #0e7490)",
  rose: "linear-gradient(135deg, #1a0a14, #4a1a3a, #9d174d, #f43f5e)",
  mint: "linear-gradient(135deg, #022c22, #065f46, #10b981, #a7f3d0)",
};

const FlipClock = () => {
  const [time, setTime] = useState(new Date());
  const [bg, setBg] = useState<BgMode>("dark");
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = pad(time.getHours());
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());

  const isLight = bg === "light";
  const isDigitDark = !isLight; // flip card tone: dark cards on everything except "light"

  const textColor = isLight ? "text-neutral-900" : "text-white";
  const subtle = isLight ? "text-black/50" : "text-white/60";
  const borderCls = isLight ? "border-black/10 hover:bg-black/5" : "border-white/15 hover:bg-white/10";

  const bgStyle: React.CSSProperties =
    bg === "dark"
      ? { background: "#000" }
      : bg === "light"
      ? { background: "#f5f5f5" }
      : { backgroundImage: gradients[bg], backgroundSize: "300% 300%" };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden transition-colors ${textColor}`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        style={bgStyle}
        animate={
          bg !== "dark" && bg !== "light"
            ? { backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"] }
            : undefined
        }
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {bg !== "dark" && bg !== "light" && <div className="absolute inset-0 bg-black/20" />}

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
        <Link
          to="/"
          className={`rounded-full p-2.5 border backdrop-blur-md ${borderCls} transition-colors`}
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowPalette((s) => !s)}
              className={`rounded-full p-2.5 border backdrop-blur-md ${borderCls} transition-colors`}
              title="Background"
            >
              <Palette className="w-4 h-4" />
            </button>
            {showPalette && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 rounded-2xl p-3 backdrop-blur-xl bg-black/50 border border-white/15 flex gap-2 z-30"
              >
                {(["dark", "light", "aurora", "sunset", "ocean", "rose", "mint"] as BgMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setBg(m);
                      setShowPalette(false);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      bg === m ? "border-white scale-110" : "border-white/30"
                    }`}
                    style={
                      m === "dark"
                        ? { background: "#000" }
                        : m === "light"
                        ? { background: "#f5f5f5" }
                        : { backgroundImage: gradients[m] }
                    }
                    title={m}
                  />
                ))}
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setBg(isLight ? "dark" : "light")}
            className={`rounded-full p-2.5 border backdrop-blur-md ${borderCls} transition-colors`}
            title="Toggle light/dark"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={hh[0]} dark={isDigitDark} />
            <FlipDigit value={hh[1]} dark={isDigitDark} />
          </div>
          <span className={`text-4xl sm:text-7xl font-bold ${subtle}`}>:</span>
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={mm[0]} dark={isDigitDark} />
            <FlipDigit value={mm[1]} dark={isDigitDark} />
          </div>
          <span className={`text-4xl sm:text-7xl font-bold ${subtle}`}>:</span>
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={ss[0]} dark={isDigitDark} />
            <FlipDigit value={ss[1]} dark={isDigitDark} />
          </div>
        </div>
        <p className={`font-body text-sm tracking-[0.3em] uppercase ${subtle}`}>
          {time.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  );
};

export default FlipClock;
