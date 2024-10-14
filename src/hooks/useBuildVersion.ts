import { useCallback, useEffect } from "react";

import { setItem } from "helpers/localStorage";

import { ENV } from "config";
import { ELOCALSTORAGE_KEY } from "constants/index";

export const useBuildVersion = () => {
  const clearCache = useCallback(() => {
    if (caches) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
  }, []);

  const validateBuildVersion = useCallback(() => {
    if (ENV === "development") return;

    fetch("/meta.json", { cache: "no-store" })
      .then((response) => response.json())
      .then((meta) => {
        const latestBuildVersion = meta?.buildVersion;
        const localBuildVersion = localStorage.getItem(
          ELOCALSTORAGE_KEY.BUILD_VERSION
        );
        if (
          latestBuildVersion &&
          `${localBuildVersion}` !== `${latestBuildVersion}`
        ) {
          console.log(`New version available: ${latestBuildVersion}`);
          clearCache();
          setItem(ELOCALSTORAGE_KEY.BUILD_VERSION, latestBuildVersion).then(
            () => {
              window.location.reload();
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [clearCache]);

  useEffect(() => {
    validateBuildVersion();
  }, [validateBuildVersion]);
};
