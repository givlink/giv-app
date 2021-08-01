import React from "react";

const DEFAULT_OPTS = {
  pollInterval: 10000, //ms
  disableInDev: false,
  key: "assetManifest",
  fetchUrl: "/asset-manifest.json",
  onUpdateAvailable: () => {
    console.log("app update available.");
  },
};

export default function useUpdateNotifier(config = {}) {
  React.useEffect(() => {
    const opts = { ...DEFAULT_OPTS, ...config };

    if (opts.disableInDev && process.env.NODE_ENV === "development") {
      return;
    }

    let value = window.localStorage.getItem(opts.key);

    const refetchAndCompare = async () => {
      try {
        const resp = await fetch(opts.fetchUrl);
        const result = await resp.json();
        const newValue = JSON.stringify(result);

        if (value && newValue !== value) opts.onUpdateAvailable();

        value = newValue;
      } catch (err) {
        console.warn("unable to check for app updates:", err.message);
      }
    };

    const t = setInterval(refetchAndCompare, opts.pollInterval);
    return () => {
      clearInterval(t);
      window.localStorage.setItem(opts.key, value); //Save last checked value
    };
  }, [config]);

  return null;
}
