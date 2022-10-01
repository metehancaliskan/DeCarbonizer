import React, { useContext, useState } from "react";
import { Button } from "@material-ui/core";
import { NavHashLink as NavLink } from "react-router-hash-link";
import { makeStyles } from "@material-ui/core/styles";

import "./Landing.css";
import { ThemeContext } from "../../contexts/ThemeContext";
import { headerData } from "../../data/headerData";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Logo from "../../assets/png/logo.png";

function textShorter(text, first, end) {
  if (text.length > first + end) {
    return (
      text.substring(0, first) +
      "..." +
      text.substring(text.length - end, text.length)
    );
  } else {
    return text;
  }
}

function Landing() {
  const { theme, drawerOpen } = useContext(ThemeContext);

  const useStyles = makeStyles((t) => ({
    resumeBtn: {
      color: theme.primary,
      borderRadius: "30px",
      textTransform: "inherit",
      textDecoration: "none",
      width: "150px",
      fontSize: "1rem",
      fontWeight: "500",
      height: "50px",
      fontFamily: "var(--primaryFont)",
      border: `3px solid ${theme.primary}`,
      transition: "100ms ease-out",
      "&:hover": {
        backgroundColor: theme.tertiary,
        color: theme.secondary,
        border: `3px solid ${theme.tertiary}`,
      },
      [t.breakpoints.down("sm")]: {
        width: "180px",
      },
    },
    contactBtn: {
      backgroundColor: theme.primary,
      color: theme.secondary,
      borderRadius: "30px",
      textTransform: "inherit",
      textDecoration: "none",
      width: "150px",
      height: "50px",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "var(--primaryFont)",
      border: `3px solid ${theme.primary}`,
      transition: "100ms ease-out",
      "&:hover": {
        backgroundColor: theme.secondary,
        color: theme.tertiary,
        border: `3px solid ${theme.tertiary}`,
      },
      [t.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    logInBtn: {
      backgroundColor: theme.primary,
      color: theme.secondary,
      borderRadius: "30px",
      textTransform: "inherit",
      textDecoration: "none",
      width: "300px",
      height: "50px",
      fontSize: "1rem",
      fontWeight: "500",
      fontFamily: "var(--primaryFont)",
      border: `3px solid ${theme.primary}`,
      transition: "100ms ease-out",
      "&:hover": {
        backgroundColor: theme.secondary,
        color: theme.tertiary,
        border: `3px solid ${theme.tertiary}`,
      },
      [t.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  }));

  const classes = useStyles();

  const [walletHover, setWalletHover] = useState(false);
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const metamaskConnector = connectors[0];

  const onClickLogIn = () => {
    connect({ connector: metamaskConnector });
    setWalletHover(false);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="landing">
      <div className="landing--container">
        <div
          className="landing--container-left"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <img
          src={Logo}
          alt=""
          className="landing--img"
          style={{
            opacity: `${drawerOpen ? "0" : "1"}`,
            borderColor: theme.secondary,
          }}
        />
        <div
          className="landing--container-right"
          style={{ backgroundColor: theme.secondary }}
        >
          <div className="lcr--content" style={{ color: theme.tertiary }}>
            <h6>{headerData.title}</h6>
            <h1>{headerData.name}</h1>
            <p>{headerData.desciption}</p>

            <div className="lcr-buttonContainer">
              {address ? (
                <Button
                  className={classes.logInBtn}
                  onClick={handleDisconnect}
                  onMouseEnter={() => setWalletHover(true)}
                  onMouseLeave={() => setWalletHover(false)}
                >
                  {walletHover ? "Disconnect" : textShorter(address, 5, 3)}
                </Button>
              ) : (
                <Button className={classes.logInBtn} onClick={onClickLogIn}>
                  Log In with MetaMask
                </Button>
              )}

              {/* <NavLink to="/#contacts" smooth={true} spy="true" duration={2000}>
                <Button className={classes.contactBtn}>Contact</Button>
              </NavLink> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
