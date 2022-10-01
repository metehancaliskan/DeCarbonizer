import React from "react";
import { Helmet } from "react-helmet";

import {
  Navbar,
  Footer,
  Landing,
  About,
  Contacts,
  Stake,
  Donation,
  Burn,
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
      <Donation />
      <Burn />
      {/* <About /> */}
      {/* <Contacts /> */}
      {/* <Footer /> */}
    </div>
  );
}

export default Main;
