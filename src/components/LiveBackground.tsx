import { motion } from "framer-motion";

interface LiveBackgroundProps {
  variant?: "aurora" | "sunset" | "ocean" | "mono";
}

// Pure-CSS / framer animated aesthetic backgrounds — no images, very lightweight.
export const LiveBackground = ({ variant = "aurora" }: LiveBackgroundProps) => {
  const gradients: Record<string, string[]> = {
    aurora: ["#0f172a", "#1e1b4b", "#312e81", "#0f766e", "#1e1b4b"],
    sunset: ["#1a1033", "#4a1a4a", "#7a2d4a", "#c2410c", "#1a1033"],
    ocean: ["#020617", "#0c4a6e", "#155e75", "#0e7490", "#020617"],
    mono: ["#000000", "#111111", "#1a1a1a", "#0a0a0a", "#000000"],
  };
  const colors = gradients[variant];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient base */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})`,
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 100%", "100% 0%", "0% 0%"],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating glow orbs */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            width: 340 + i * 60,
            height: 340 + i * 60,
            background: `radial-gradient(circle, ${colors[(i + 1) % colors.length]}, transparent 70%)`,
            left: `${(i * 27) % 80}%`,
            top: `${(i * 41) % 70}%`,
          }}
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grain / stars */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};
