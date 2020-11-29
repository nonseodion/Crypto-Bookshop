import React, { useState } from 'react';
import Button from "../../../Button/Button";
import Input from "../../../Input/Input";
import classes from "./ListView.module.css";

import { useWeb3React } from "@web3-react/core";
import { Contract }  from "@ethersproject/contracts";
import BookShop from "../../../../contracts/BookShop.json";
import OpenBooks from "../../../../contracts/OpenBooks.json";
import { parseEther, formatEther, parseUnits } from "@ethersproject/units";
import { AddressZero } from "@ethersproject/constants";
import useNetworkId from "../../../Hooks/useNetworkId";

const List = ({id, book, setBookPrice}) => {
  const { account, library, chainId } = useWeb3React();
  const bookShopAbi = BookShop.abi;
  const openBooksAbi = OpenBooks.abi;
  const networkId = useNetworkId(chainId);
  

  let [price, setPrice] = useState("");

  const list = () => {
    if(!library || price === "") return;
    if(!networkId) {
      console.log("Contracts not deployed on this network");
      return;
    }
    const bookShopAddress = BookShop.networks[networkId].address;
    const contract = new Contract(bookShopAddress, bookShopAbi, library.getSigner());
    contract["list"](parseUnits(id, "wei"), parseEther(price));
    const listEvent = contract.filters.List(account, parseUnits(id, "wei"), null);
    library.once(listEvent, () => {
      contract["getPrice"](parseUnits(id, "wei")).then(result => {
        setBookPrice(formatEther(result));
      });
    });
  }

  const burn = () => {
    if(!library) return;
    if(!networkId) {
      console.log("Contracts not deployed on this network");
      return;
    }
    const openBooksAddress = OpenBooks.networks[networkId].address;
    const contract = new Contract(openBooksAddress, openBooksAbi, library.getSigner());
    contract["burn"](parseUnits(id, "wei"));
    const burnEvent = contract.filters.Transfer(account, AddressZero, null);
    library.once(burnEvent, () => {
      window.location.href = window.location.href.replace("book", "dashboard");
    });
  }

  return(
    <div>
      <span className={classes["block-display"]}>
        <Input onChange={(event) => setPrice(event.target.value)} value={price}/>
        <Button color="normal" onClick={list}>List</Button>
      </span>
        <Button color="red" onClick={burn}>Delete</Button>
        <p><a href={book} color="green">Download</a></p>
    </div>
  )
};

export default List;