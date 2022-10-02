import React, { useContext, useState } from "react";
import "./Stake.css";
import { ThemeContext } from "../../contexts/ThemeContext";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import StakeImg from "../../assets/svg/StakeImg.svg";

import {
  useContractWrite,
  useAccount,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";

import { notification } from "antd";

import contractAddress from "../../contracts/contractAddress.json";
import stableCoinAbi from "../../contracts/MockStableCoin.json";
import treeTokenAbi from "../../contracts/TreeToken.json";
import carbonTokenAbi from "../../contracts/CarbonToken.json";

import { BigNumber } from "ethers";

import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

function convertToBigNumber(value) {
  try {
    const DECIMALS = BigNumber.from(10).pow(BigNumber.from(18));
    let newValue = BigNumber.from(value);
    return newValue.mul(DECIMALS);
  } catch (e) {
    return null;
  }
}

function convertFromBigNumber(value) {
  try {
    const DECIMALS = BigNumber.from(10).pow(BigNumber.from(16));
    let newValue = BigNumber.from(value);
    return newValue.div(DECIMALS).toNumber() / 100;
  } catch (e) {
    return null;
  }

}

function convertFromBigNumberClaim(value) {
  try {
    let newValue = value.toNumber();
    return newValue / (10 ** 18);
  } catch (e) {
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
      width: "30%",
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
      width: "30%",
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
  };

  const carbonParameters = {
    addressOrName: contractAddress.carbonToken,
    contractInterface: carbonTokenAbi,
  };


  const carbonBalanceData = useContractRead({
    ...carbonParameters,
    functionName: "balanceOf",
    args: [address],
    watch: true,
  });

  const carbonBalance = convertFromBigNumber(carbonBalanceData.data);

  const treeBalanceData = useContractRead({
    ...treeParameters,
    functionName: "balanceOf",
    args: [address],
    watch: true
  })


  const treeBalance = convertFromBigNumber(treeBalanceData.data);

  const stakeData = useContractRead({
    ...carbonParameters,
    functionName: 'stakeInfos',
    args: [address],
    watch: true
  })

  const isStakedData = useContractRead({
    ...carbonParameters,
    functionName: 'addressStaked',
    args: [address],
    watch: true
  })

  const isStaked = isStakedData.data;

  let stakedAmount;
  //console.log(stakeData)
  if (stakeData?.data?.amount) {
    stakedAmount = convertFromBigNumber(stakeData.data.amount);
  }


  let stakeClaimDataConfig;


  stakeClaimDataConfig = {
    ...carbonParameters,
    functionName: 'expectedGain',
    args: [address],
    watch: true
  }



  const stakeClaimData = useContractRead(stakeClaimDataConfig)

  const stakeClaimAmount = convertFromBigNumberClaim(stakeClaimData.data);

  const [transactionHash, setTransactionHash] = useState();



  const approveWriteData = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...treeParameters,
    functionName: 'approve',
    chainId: contractAddress.chainId,
    args: [contractAddress.carbonToken, convertToBigNumber(stake)],
    onSuccess(data) {
      //console.log("onsuccess", data)
      setTransactionHash(data.hash);
    },
    onSettled(data, error) {
      //console.log('Settled', { data, error })
      if (error) {

        notification.open({
          message: <p className='error-title'>Hata</p>,
          description: <p className='error-description'>{error.message}</p>,
          placement: "topLeft",
          className: "notification shadow",
          icon: <CloseCircleFilled style={{ color: 'rgb(210,40,40)' }} />,
        });
      }
    },
  })

  const stakeWriteData = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...carbonParameters,
    functionName: 'stakeTreeToken',
    chainId: contractAddress.chainId,
    args: [convertToBigNumber(stake)],
    onSuccess(data) {
      //console.log("onsuccess", data)
      setTransactionHash(data.hash);
    },
    onSettled(data, error) {
      //console.log('Settled', { data, error })
      if (error) {

        notification.open({
          message: <p className='error-title'>Hata</p>,
          description: <p className='error-description'>{error.message}</p>,
          placement: "topLeft",
          className: "notification shadow",
          icon: <CloseCircleFilled style={{ color: 'rgb(210,40,40)' }} />,
        });
      }
    },
  })

  const claimWriteData = useContractWrite({
    mode: 'recklesslyUnprepared',
    ...carbonParameters,
    functionName: 'claimCarbonToken',
    chainId: contractAddress.chainId,
    args: [],
    onSuccess(data) {
      //console.log("onsuccess", data)
      setTransactionHash(data.hash);
    },
    onSettled(data, error) {
      //console.log('Settled', { data, error })
      if (error) {

        notification.open({
          message: <p className='error-title'>Hata</p>,
          description: <p className='error-description'>{error.message}</p>,
          placement: "topLeft",
          className: "notification shadow",
          icon: <CloseCircleFilled style={{ color: 'rgb(210,40,40)' }} />,
        });
      }
    },
  })

  let transactionWaitConfig = {};
  if (transactionHash) {
    transactionWaitConfig = {
      hash: transactionHash,
      onSuccess(data) {
        if (data?.status == 0) {
          notification.open({
            message: <p className='error-title'>Error</p>,
            description: <p className='error-description'>İşlem Onaylanmadı</p>,
            placement: "topLeft",
            className: "notification shadow",
            icon: <CloseCircleFilled style={{ color: 'rgb(210,40,40)' }} />,
          });
        } else {
          //console.log(data)
          notification.open({
            message: <p className='success-title'>Success</p>,
            description: <p className='success-description'>İşlem Onaylandı!</p>,
            placement: "topLeft",
            className: "notification shadow",
            icon: <CheckCircleFilled style={{ color: 'rgb(50,130,0)' }} />,
            duration: 12,
          });
        }

      },
    };
  }


  const onClickApprove = () => {
    approveWriteData.write();
  };

  const onClickStake = () => {
    stakeWriteData.write();
  };

  const onClickClaim = () => {
    claimWriteData.write();
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

          <h1>{address && "Your Balance: " + treeBalance + " TREE"}</h1>
          <h1>{address && "Your Balance: " + carbonBalance + " CARBON"}</h1>
          {isStaked ?
            <>
              <h1>{address && "Staked Amount: " + stakedAmount + " TREE"}</h1>
              <h1>{address && stakeClaimAmount && "Claimable Amount: " + stakeClaimAmount + " CARBON"}</h1>
              </>
              :
              <>
                <h1>{address && "Staked Amount: " + 0 + " TREE"}</h1>
                <h1>{address && stakeClaimAmount && "Claimable Amount: " + 0 + " CARBON"}</h1>
              </>
          }

          <div className="lcr-buttonContainer">
            <Button className={classes.contactBtn} onClick={onClickApprove}>
              Approve TREE
            </Button>
            <Button className={classes.resumeBtn} onClick={onClickStake}>
              Stake
            </Button>
            <Button className={classes.contactBtn} onClick={onClickClaim}>
              Claim
            </Button>
          </div>
        </div>
        <div className="about-img">
          <img src={StakeImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Stake;
