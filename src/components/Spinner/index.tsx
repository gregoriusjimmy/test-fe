import cn from "lib/cn";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "w-8 h-8 border-4 border-gra-500 border-t-transparent rounded-full animate-spin",
        className
      )}
    />
  );
};

export default Spinner;
