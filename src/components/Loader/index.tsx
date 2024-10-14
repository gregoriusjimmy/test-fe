import cn from "lib/cn";

import styles from "./Loader.module.css";

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return <div className={cn(styles.loader, className)} />;
};

export default Loader;
