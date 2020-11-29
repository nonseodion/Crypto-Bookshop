import React, { useState } from 'react';

import Input from "../../../Input/Input";
import Button from "../../../Button/Button";

import classes from "./DeListView.module.css";

import { useWeb3React } from "@web3-react/core";
import { Contract }  from "@ethersproject/contracts";
import BookShop from "../../../../contracts/BookShop.json";
import { parseEther, formatEther, parseUnits } from "@ethersproject/units";
import { EtherSymbol } from "@ethersproject/constants";
import useNetworkId from "../../../Hooks/useNetworkId";


const DeListView = ({id, price, book, setBookPrice}) => {

  const { account, library, chainId } = useWeb3React();
  const bookShopAbi = BookShop.abi;
  const networkId = useNetworkId(chainId);

  let [priceEntered, setPriceEntered] = useState("");

  const changePrice = () => {
    if(!library || priceEntered === "") return;
    if(!networkId) {
      console.log("Contracts not deployed on this network");
      return;
    }
    const bookShopAddress = BookShop.networks[networkId].address;
    const contract = new Contract(bookShopAddress, bookShopAbi, library.getSigner());
    contract["list"](parseUnits(id, "wei"), parseEther(priceEntered));
    const listEvent = contract.filters.List(account, parseUnits(id, "wei"), null);
    library.once(listEvent, () => {
      contract["getPrice"](parseUnits(id, "wei")).then(result => {
        setBookPrice(formatEther(result));
      });
    });
  }

  const deList = () => {
    if(!library) return;
    if(!networkId) {
      console.log("Contracts not deployed on this network");
      return;
    }
    const bookShopAddress = BookShop.networks[networkId].address;
    const contract = new Contract(bookShopAddress, bookShopAbi, library.getSigner());
    contract["deList"](parseUnits(id, "wei"));
    const deListEvent = contract.filters.DeList(account, parseUnits(id, "wei"));
    library.once(deListEvent, () => {
      contract["getPrice"](parseUnits(id, "wei")).then(result => {
        setBookPrice(formatEther(result));
      });
    });
  }

  return(
    <div>
      {EtherSymbol} <span>{price}</span>
      <span className={classes["block-display"]}>
        <Input onChange={(event) => setPriceEntered(event.target.value)} value={priceEntered}/>
        <Button color="normal" onClick={changePrice}>Change Price</Button>
      </span>
        <Button color="red" onClick={deList}>Delist</Button>
        <p><a href={book} color="green">Download</a></p>
    </div>
  );
};

export default DeListView;