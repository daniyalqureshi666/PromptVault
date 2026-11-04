import { Folder, Code, Brain, Database, GraduationCap, PenLine, Briefcase, Star } from 'lucide-react';

const MAP = { folder: Folder, code: Code, brain: Brain, database: Database, graduation: GraduationCap, pen: PenLine, briefcase: Briefcase, star: Star };

export function CategoryIcon({ name, size = 14 }) {
  const Icon = MAP[name] || Folder;
  return <Icon size={size} aria-hidden="true" />;
}
