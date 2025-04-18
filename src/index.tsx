import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initMocks } from "./mocks";

async function prepare() {
  if (process.env.NODE_ENV === "development") {
    await initMocks();
  }
}

prepare().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
