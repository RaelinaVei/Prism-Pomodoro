import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { FlipDigit } from "@/components/FlipDigit";

const pad = (n: number) => n.toString().padStart(2, "0");

const FlipClock = () => {
  const [time, setTime] = useState(new Date());
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = pad(time.getHours());
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());

  const bg = dark ? "bg-black" : "bg-neutral-100";
  const text = dark ? "text-white" : "text-neutral-900";
  const sep = dark ? "text-white/40" : "text-neutral-400";

  return (
    <div className={`relative min-h-screen w-full ${bg} ${text} transition-colors`}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4">
        <Link
          to="/"
          className={`rounded-full p-2.5 border ${
            dark ? "border-white/15 hover:bg-white/10" : "border-black/10 hover:bg-black/5"
          } transition-colors`}
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <button
          onClick={() => setDark((d) => !d)}
          className={`rounded-full p-2.5 border ${
            dark ? "border-white/15 hover:bg-white/10" : "border-black/10 hover:bg-black/5"
          } transition-colors`}
          title="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={hh[0]} dark={dark} />
            <FlipDigit value={hh[1]} dark={dark} />
          </div>
          <span className={`text-4xl sm:text-7xl font-bold ${sep}`}>:</span>
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={mm[0]} dark={dark} />
            <FlipDigit value={mm[1]} dark={dark} />
          </div>
          <span className={`text-4xl sm:text-7xl font-bold ${sep}`}>:</span>
          <div className="flex gap-1 sm:gap-2">
            <FlipDigit value={ss[0]} dark={dark} />
            <FlipDigit value={ss[1]} dark={dark} />
          </div>
        </div>
        <p className={`font-body text-sm tracking-[0.3em] uppercase ${dark ? "text-white/50" : "text-black/50"}`}>
          {time.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>
    </div>
  );
};

export default FlipClock;
