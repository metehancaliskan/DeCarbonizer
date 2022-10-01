import React from "react";
import { Helmet } from "react-helmet";

import {
  Navbar,
  Footer,
  Landing,
  About,
  Contacts,
  Stake,
} from "../../components";
import { headerData } from "../../data/headerData";

function Main() {
  return (
    <div>
      <Helmet>
        <title>{headerData.name} - Porfolio</title>
      </Helmet>

      <Navbar />
      <Landing />
      <Stake />
      <About />
      <Contacts />
      {/* <Footer /> */}
    </div>
  );
}

export default Main;
