import cn from "lib/cn";

interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
}
const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("bg-background h-full text-grey7-50", className)}>
      {children}
    </div>
  );
};

export default PageContainer;
