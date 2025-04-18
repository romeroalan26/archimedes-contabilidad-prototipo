import { worker } from "./browser";

if (process.env.NODE_ENV === "development") {
  worker
    .start({
      onUnhandledRequest: "warn",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
    .then(() => {
      console.log("[MSW] Mock Service Worker started successfully");
    })
    .catch((error) => {
      console.error("[MSW] Error starting Mock Service Worker:", error);
    });
}
