import React, { useState} from 'react';
import Button from "../../../Button/Button";
import classes from "./Buy.module.css";

import { useWeb3React } from "@web3-react/core";
import { Contract }  from "@ethersproject/contracts";
import BookShop from "../../../../contracts/BookShop.json";
import { parseEther, parseUnits } from "@ethersproject/units";

const Buy = ({id, book, price}) => {
  const { account, library } = useWeb3React();
  const abi = BookShop.abi;
  const address = BookShop.networks[chainId === 1337 ? "5777" : chainId.toString()].address;

  let [bought, setBought] = useState(false);

  const buy = () => {
    if(!library) return;
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