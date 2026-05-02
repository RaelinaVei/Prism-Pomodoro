import { Calculator, BookOpen, Leaf, FlaskConical, Atom, type LucideIcon } from "lucide-react";

export interface Section {
  id: string;
  title: string;
  desc: string;
}

export interface Subject {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  gradient: string; // tailwind-friendly gradient string
  accent: string;   // hex used for soft glow
  sections: Section[];
}

const baseSections: Section[] = [
  { id: "teachers", title: "Teachers' Notes", desc: "Notes from your teachers, organized by name" },
  { id: "important", title: "Important Things", desc: "Key formulas, definitions & must-knows" },
  { id: "other", title: "Other Notes", desc: "Loose notes, ideas & references" },
  { id: "questions", title: "Practice Questions", desc: "Track problems & doubts" },
  { id: "summary", title: "Quick Summary", desc: "TL;DR of each chapter" },
];

export const subjects: Subject[] = [
  {
    id: "maths",
    name: "Maths",
    tagline: "logic · proofs · patterns",
    icon: Calculator,
    gradient: "from-indigo-500/30 via-violet-500/20 to-fuchsia-500/30",
    accent: "#8b5cf6",
    sections: baseSections,
  },
  {
    id: "english",
    name: "English",
    tagline: "language · literature · craft",
    icon: BookOpen,
    gradient: "from-rose-500/30 via-pink-500/20 to-orange-400/30",
    accent: "#fb7185",
    sections: baseSections,
  },
  {
    id: "biology",
    name: "Biology",
    tagline: "life · cells · systems",
    icon: Leaf,
    gradient: "from-emerald-500/30 via-teal-500/20 to-green-500/30",
    accent: "#10b981",
    sections: baseSections,
  },
  {
    id: "chemistry",
    name: "Chemistry",
    tagline: "atoms · bonds · reactions",
    icon: FlaskConical,
    gradient: "from-cyan-500/30 via-sky-500/20 to-blue-500/30",
    accent: "#06b6d4",
    sections: baseSections,
  },
  {
    id: "physics",
    name: "Physics",
    tagline: "forces · energy · cosmos",
    icon: Atom,
    gradient: "from-amber-500/30 via-yellow-500/20 to-orange-500/30",
    accent: "#f59e0b",
    sections: baseSections,
  },
];

export const getSubject = (id: string) => subjects.find((s) => s.id === id);
export const getSection = (subjectId: string, sectionId: string) =>
  getSubject(subjectId)?.sections.find((s) => s.id === sectionId);
