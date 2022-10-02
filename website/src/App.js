import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { Main } from "./pages";
import { BackToTop } from "./components";
import ScrollToTop from "./utils/ScrollToTop";
import { useAccount, useBlockNumber } from "wagmi";

import { ThemeContext } from "./contexts/ThemeContext";

import "./App.css";
import 'antd/dist/antd.css'
import Donation from "./components/Donation/Donation";

function App() {



  // console.log("%cDEVELOPER PORTFOLIO", `color:${theme.primary}; font-size:50px`);
  // console.log("%chttps://github.com/hhhrrrttt222111/developer-portfolio", `color:${theme.tertiary}; font-size:20px`);
  // console.log = console.warn = console.error = () => {};
 


    const { theme } = useContext(ThemeContext);
    return (
      <div>
        
      <div className="app">
        
        <Router>
          <ScrollToTop />
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/projects" exact component={Main} />

            <Redirect to="/" />
          </Switch>
        </Router>
        <BackToTop />
      </div>
      </div>
    );
  

}

export default App;
