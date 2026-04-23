import { Maximize2, Minimize2 } from "lucide-react";
import { useFullscreen } from "@/hooks/useFullscreen";

export function FullscreenButton({ className = "" }: { className?: string }) {
  const { isFs, toggle } = useFullscreen();
  return (
    <button
      onClick={toggle}
      title={isFs ? "Exit fullscreen" : "Fullscreen"}
      className={`glass rounded-full p-2.5 text-white hover:scale-110 transition-transform ${className}`}
    >
      {isFs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
    </button>
  );
}
