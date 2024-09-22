import { cn } from "@/lib/utils";

interface MaxWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const MaxWrapper: React.FC<MaxWrapperProps> = ({ className, children }) => {
  return <div className={cn("w-full md:container mx-auto ", className)}>{children}</div>;
};
export default MaxWrapper;
