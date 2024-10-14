import { useEffect, useState } from "react";

export const useRenderStatus = (timeoutMs = 1000) => {
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBusy(false);
    }, timeoutMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeoutMs]);

  return busy;
};
