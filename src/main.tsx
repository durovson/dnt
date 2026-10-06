import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "../vendor/telegram-ui-kit/src/context/ThemeProvider";
import "../vendor/telegram-ui-kit/src/styles/index.scss";
import "./styles.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
