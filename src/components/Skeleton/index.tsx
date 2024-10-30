import cn from "lib/cn";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("animate-pulse bg-gray-500 rounded-lg", className)} />
  );
};

export default Skeleton;
