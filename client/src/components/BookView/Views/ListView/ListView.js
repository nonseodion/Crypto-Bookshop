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

const List = ({id, book, setBookPrice}) => {
  const { account, library } = useWeb3React();
  const bookShopAbi = BookShop.abi;
  const bookShopAddress = BookShop.networks["5777"].address;

  const openBooksAbi = OpenBooks.abi;
  const openBooksAddress = OpenBooks.networks["5777"].address;

  let [price, setPrice] = useState("");

  const list = () => {
    if(!library || price === "") return;
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