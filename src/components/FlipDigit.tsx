import { AnimatePresence, motion } from "framer-motion";

interface FlipDigitProps {
  value: string;
  dark: boolean;
}

export const FlipDigit = ({ value, dark }: FlipDigitProps) => {
  const bg = dark ? "bg-neutral-900 text-white" : "bg-white text-neutral-900";
  const border = dark ? "border-neutral-800" : "border-neutral-200";

  return (
    <div
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl border ${border} ${bg} shadow-2xl
      w-[72px] h-[100px] sm:w-[120px] sm:h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center`}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: -90, opacity: 0, y: -20 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 90, opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="font-display font-bold text-5xl sm:text-8xl md:text-9xl tabular-nums"
          style={{ transformStyle: "preserve-3d" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      {/* center divider line */}
      <div
        className={`absolute left-0 right-0 top-1/2 h-px ${
          dark ? "bg-black/60" : "bg-neutral-300"
        }`}
      />
    </div>
  );
};
