import React, { useState} from 'react';
import Button from "../../../Button/Button";
import classes from "./Buy.module.css";

import { useWeb3React } from "@web3-react/core";
import { Contract }  from "@ethersproject/contracts";
import BookShop from "../../../../contracts/BookShop.json";
import { parseEther, parseUnits } from "@ethersproject/units";
import useNetworkId from "../../../Hooks/useNetworkId";


const Buy = ({id, book, price}) => {
  const { account, library, chainId } = useWeb3React();
  const abi = BookShop.abi;
  const networkId = useNetworkId(chainId);  

  

  let [bought, setBought] = useState(false);

  const buy = () => {
    if(!library) return;
    if(!networkId) {
      console.log("Contracts not deployed on this network");
      return;
    }
    const address = BookShop.networks[networkId].address;
    const contract = new Contract(address, abi, library.getSigner());
    contract["buy"](parseUnits(id, "wei"), {value: parseEther(price)});
    const buyEvent = contract.filters.Buy(null, account, parseUnits(id, "wei"));
    library.once(buyEvent, () => {
      setBought(true);
      console.log("ok");
    });
  }

  
  
  return(
    <div className={classes["about"]}>
      <span className={classes["price"]}>ETH {price}</span>
      {bought ? 
        <a href={book} color="green">Download</a> : 
        <Button color="green" onClick={buy}>Buy</Button>}
    </div>
  );
};

export default Buy;