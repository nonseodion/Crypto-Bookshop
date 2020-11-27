import React, { useEffect } from "react";
import Button from "../../Button/Button";
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";
import { formatUnits } from "@ethersproject/units";
import useSWR from "swr";
import fetcher from "../../../Fetcher";

const Wallet = () => {
  const { activate, library, active, account, chainId } = useWeb3React();
  console.log(chainId, library);
  const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 5777, 1337] });
  const onClick = () => {
    activate(injected);
  };
  const {data: balance, mutate} = useSWR(["getBalance", account], fetcher(library));


  useEffect(() => {
    if(!active) return;
    library.on("block", () => {
      mutate(undefined, true);
    })

    return(() => {
      library.removeAllListeners();
    })
  }, [account, active, library, mutate]);

  return (
    !balance ?
      <Button color="normal" onClick={onClick}>
        Connect Wallet
      </Button> :
      <span>ETH {parseFloat(formatUnits(balance.toString())).toFixed(4)} | {`${account.slice(0, 4)}...${account.slice(-2)}`}</span>
  );
};

export default Wallet;
