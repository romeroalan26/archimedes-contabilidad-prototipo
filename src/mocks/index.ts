import { worker } from "./browser";
import { server } from "./server";

export async function initMocks() {
  if (typeof window === "undefined") {
    server.listen();
  } else {
    worker.start();
  }
}

initMocks();
