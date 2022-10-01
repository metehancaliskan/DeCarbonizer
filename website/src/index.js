import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import WagmiComponent from "./WagmiComponent";
import reportWebVitals from "./reportWebVitals";
import ThemeContextProvider from "./contexts/ThemeContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.render(
  <ThemeContextProvider>
    <WagmiComponent />
   
  </ThemeContextProvider>,
  document.getElementById("root")
);

reportWebVitals();
