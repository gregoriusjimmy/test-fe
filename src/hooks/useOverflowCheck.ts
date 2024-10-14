import { useEffect, useRef, useState } from "react";

export const useOverflowCheck = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const isOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isOverflow);
    }
  }, []);

  return { ref, isOverflowing };
};
