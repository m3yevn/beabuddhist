import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { prefetchCatalog } from "./catalogIndex";

prefetchCatalog();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/app/sw.js").catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
