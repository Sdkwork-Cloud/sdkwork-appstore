import { LucideProps } from "lucide-react";
import * as Icons from "lucide-react";

interface DynamicIconProps extends Omit<LucideProps, 'className'> {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent {...props} />;
}
