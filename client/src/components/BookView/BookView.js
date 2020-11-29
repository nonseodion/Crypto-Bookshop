import React, { useState, useEffect } from 'react';
import Book from '../Books/Book';
import classes from "./BookView.module.css";
import ListView from "./Views/ListView/ListView";
import DeListView from "./Views/DeListView/DeListView";
import Buy from "./Views/Buy/Buy";

//contract and contract dependencies
import { useWeb3React } from "@web3-react/core";
import { Contract }  from "@ethersproject/contracts";
import OpenBooks from "../../contracts/OpenBooks.json";
import { parseUnits } from "@ethersproject/units";
let networkId = {"1":"1", "3": "3", "4": "4", "42": "42", "5": "5", "1337": "5777"}


let View;

const BookView = (props) => {
  if(props.name === "" ) window.location.href = window.location.href.replace("book", "");
  let [isOwner, setIsOwner] = useState(false);

  const { account, library, chainId } = useWeb3React();
  const abi = OpenBooks.abi;
  const address = OpenBooks.networks[networkId[chainId]].address;
  
  useEffect(() => {
    if(!library) return;
    const contract = new Contract(address, abi, library.getSigner());
    contract["ownerOf"](parseUnits(props.id.toString(), "wei")).then( async res => {
      await setIsOwner(res === account);
    });
  });

  
    if(isOwner){
      if(props.price > 0){
        View = <DeListView
          id = {props.id}
          price = {props.price}
          book = {props.book}
          setBookPrice = {props.setPrice}
        />
      }else{
        View = <ListView 
        id = {props.id}
        book = {props.book}
        setBookPrice = {props.setPrice}
      />
      }
    }else{
      View = <Buy 
      id = {props.id}
      book = {props.book}
      price = {props.price}
      setBookPrice = {props.setPrice}
    />
    }

    // else{
    //   window.location.href = window.location.href.replace("book", "");
    // }

  return(
    <div className={classes["bookView"]}>
      <Book image={props.image} name={props.name}/>
      {View}
    </div>
  );
};

export default BookView;