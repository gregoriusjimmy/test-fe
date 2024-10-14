import { useEffect, useRef } from "react";

export const useCombinedRefs = <T>(
  ...refs: (React.Ref<T> | null)[]
): React.RefObject<T> => {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else if (typeof ref === "object" && ref !== null && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
