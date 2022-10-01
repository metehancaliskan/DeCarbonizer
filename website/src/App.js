import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { ThemeContext } from "./contexts/ThemeContext";
import { Main } from "./pages";
import { BackToTop } from "./components";
import ScrollToTop from "./utils/ScrollToTop";
import { useBlockNumber } from "wagmi";

import "./App.css";

function App() {
  const blockData = useBlockNumber();
  const { theme } = useContext(ThemeContext);

  // console.log("%cDEVELOPER PORTFOLIO", `color:${theme.primary}; font-size:50px`);
  // console.log("%chttps://github.com/hhhrrrttt222111/developer-portfolio", `color:${theme.tertiary}; font-size:20px`);
  // console.log = console.warn = console.error = () => {};

  return (
    <div className="app">
      <div>{blockData.data}</div>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route path="/" exact component={Main} />
          {/* <Route path="/blog" exact component={BlogPage} />
          <Route path="/projects" exact component={ProjectPage} /> */}

          <Redirect to="/" />
        </Switch>
      </Router>
      <BackToTop />
    </div>
  );
}

export default App;
