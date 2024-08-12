import React from "react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";

import { App } from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        * {
          margin: 0;
          padding: 0;
        }
        body {
          font-family: system-ui, sans-serif;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        img,
        svg {
          display: block;
          max-width: 100%;
        }
        input,
        button {
          font: inherit;
        }
      `}
    />
  </React.StrictMode>,
);
