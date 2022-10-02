import React, { useContext, useState } from "react";
import "./Stake.css";
import { ThemeContext } from "../../contexts/ThemeContext";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { useContractWrite, useAccount, useWaitForTransaction, useContractRead } from "wagmi";

import { notification } from 'antd';

import contractAddress from "../../contracts/contractAddress.json"
import stableCoinAbi from "../../contracts/MockStableCoin.json"
import treeTokenAbi from "../../contracts/TreeToken.json"
import carbonTokenAbi from "../../contracts/CarbonToken.json"

import { BigNumber } from "ethers";

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

function convertToBigNumber( value ) {
  try {
  const DECIMALS = BigNumber.from(10).pow( BigNumber.from(18) );
  let newValue = BigNumber.from(value);
  return newValue.mul( DECIMALS );
  } catch(e) {
    return null;
  }
}

function convertFromBigNumber(  value ) {
  try {
  const DECIMALS = BigNumber.from(10).pow( BigNumber.from(16) );
  let newValue = BigNumber.from(value);
  return newValue.div( DECIMALS ).toNumber() / 100;
} catch(e) {
  return null;
}
}

export const Stake = () => {
  const { theme } = useContext(ThemeContext);
  const useStyles = makeStyles((t) => ({
    input: {
      border: `4px solid ${theme.primary80}`,
      backgroundColor: `${theme.secondary}`,
      color: `${theme.tertiary}`,
      fontFamily: "var(--primaryFont)",
      fontWeight: 500,
      transition: "border 0.2s ease-in-out",
      "&:focus": {
        border: `4px solid ${theme.primary600}`,
      },
    },
    message: {
      border: `4px solid ${theme.primary80}`,
      backgroundColor: `${theme.secondary}`,
      color: `${theme.tertiary}`,
      fontFamily: "var(--primaryFont)",
      fontWeight: 500,
      transition: "border 0.2s ease-in-out",
      "&:focus": {
        border: `4px solid ${theme.primary600}`,
      },
    },
    label: {
      backgroundColor: `${theme.secondary}`,
      color: `${theme.primary}`,
      fontFamily: "var(--primaryFont)",
      fontWeight: 600,
      fontSize: "0.9rem",
      padding: "0 5px",
      transform: "translate(25px,50%)",
      display: "inline-flex",
    },
    socialIcon: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "21px",
      backgroundColor: theme.primary,
      color: theme.secondary,
      transition: "250ms ease-in-out",
      "&:hover": {
        transform: "scale(1.1)",
        color: theme.secondary,
        backgroundColor: theme.tertiary,
      },
    },
    detailsIcon: {
      backgroundColor: theme.primary,
      color: theme.secondary,
      borderRadius: "50%",
      width: "45px",
      height: "45px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "23px",
      transition: "250ms ease-in-out",
      flexShrink: 0,
      "&:hover": {
        transform: "scale(1.1)",
        color: theme.secondary,
        backgroundColor: theme.tertiary,
      },
    },
    submitBtn: {
      backgroundColor: theme.primary,
      color: theme.secondary,
      width: "100%",
      transition: "250ms ease-in-out",
      "&:hover": {
        transform: "scale(1.08)",
        color: theme.secondary,
        backgroundColor: theme.tertiary,
      },
    },
    resumeBtn: {
      color: theme.primary,
      borderRadius: "30px",
      textTransform: "inherit",
      textDecoration: "none",
      width: "45%",
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
      width: "45%",
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

  const [stake, setStake] = useState();
  const { address, connector, isConnected } = useAccount();

  const treeParameters = {
    addressOrName: contractAddress.treeToken,
    contractInterface: treeTokenAbi,
  }

  const carbonParameters = {
    addressOrName: contractAddress.carbonToken,
    contractInterface: carbonTokenAbi,
  }

 
  const carbonBalanceData = useContractRead({
    ...carbonParameters,
    functionName: 'balanceOf',
    args: [address],
    watch:true
  })
  
  const carbonBalance = convertFromBigNumber(carbonBalanceData.data);
  
  const treeBalanceData = useContractRead({
    ...treeParameters,
    functionName: 'balanceOf',
    args: [address],
    watch:true
  })
  
  
  const treeBalance = convertFromBigNumber( treeBalanceData.data );


  const onClickApprove = () => {
    console.log("Approve");
  };

  const onClickStake = () => {
    console.log("Stake");
  };

  const onClickClaim = () => {
    console.log("Claim");
  };

  return (
    <div
      className="about"
      id="stake"
      style={{ backgroundColor: theme.secondary }}
    >
      <div className="line-styling">
        <div
          className="style-circle"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div
          className="style-circle"
          style={{ backgroundColor: theme.primary }}
        ></div>
        <div
          className="style-line"
          style={{ backgroundColor: theme.primary }}
        ></div>
      </div>
      <div className="about-body">
        <div className="about-description">
          <h2 style={{ color: theme.primary }}>{"Stake"}</h2>
          {/* <p style={{ color: theme.tertiary80 }}>
            {aboutData.description1}
            <br />
            <br />
            {aboutData.description2}
          </p> */}
          <div className="input-container">
            <label htmlFor="Name" className={classes.label}>
              Stake TREE
            </label>
            <input
              placeholder="50"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              type="number"
              name="Stake"
              className={`form-input ${classes.input}`}
            />
          </div>

          <div className="lcr-buttonContainer">
            <Button className={classes.resumeBtn} onClick={onClickApprove}>
              Approve TREE
            </Button>
            <Button className={classes.contactBtn} onClick={onClickStake}>
              Stake
            </Button>
            <Button className={classes.contactBtn} onClick={onClickClaim}>
              Claim
            </Button>
          </div>
        </div>
        <div className="about-img">
          <img src={theme.aboutimg1} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Stake;
