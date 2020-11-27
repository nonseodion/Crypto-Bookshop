import React, { useContext, useEffect, useState } from 'react';
import Button from "../Button/Button";
import Book from "../Books/Book";
import { BookContext } from "../../containers/App/App";
import axios from "axios";

import classes from "./Dashboard.module.css";

//contracts and dependencies
import { useWeb3React } from "@web3-react/core";
import BookShop from "../../contracts/BookShop.json";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";


const changeToEther = (prices) => {
  prices = prices.map( price => formatUnits(price.toString()));
  return prices;
}

const changeToNumbers = (nums) => {
  nums = nums.map( num => num.toString());
  return nums;
}

let [onSale, notOnSale] = ([[], []]);

const Dashboard = (props) => {
  const onBookClick = useContext(BookContext);
  const onClick = (args) => {
    onBookClick(args);
    props.history.push("/book");
  }

  const {account, library} = useWeb3React();
  const bookShopAddress = BookShop.networks["5777"].address;
  const abi = BookShop.abi;
  
  let [booksPresent, setBooksPresent] = useState(false);

  useEffect(() => {
    if(library && !booksPresent){
      const contract = new Contract(bookShopAddress, abi, library.getSigner());
      contract["getBooks"](account).then((result) => {
        setBooks(result["bookIds"], result["bookPrices"], result["URIs"]);
      })
    }
  });

  
  
  const setBooks = (ids, prices, URIs) => {

    ids = changeToNumbers(ids);
    prices = changeToEther(prices);
    URIs = URIs.split(" ").slice(1);
    console.log(prices);

    for(let i = 0; i<ids.length; i++){
      
      axios.get(URIs[i]).then((res) => {
        //let book = {id: ids[i], price: prices[i], ...res.data};
        let book = <Book key={ids[i]} 
          name = {res.data.name}
          image = {res.data.image}
          onClick={() => onClick({id: ids[i], price: prices[i], ...res.data})}
          />;
        if(prices[i] > 0){
          onSale.push(book);
        }
        else{
          notOnSale.push(book);   
        }
        if(i+1 === ids.length) setBooksPresent(true);
      })
    }
    
    
  }

  return(
    <div className={classes["dashboard"]}>
      <Button  color="normal" onClick={() => props.history.push("/mint")}>Mint Book</Button>
      <h4>My Books</h4>
      <div className={classes["books"]}>
       {notOnSale}
      </div>
      <h4>On Sale</h4>
      <div className={classes["books"]}>
        {onSale}
      </div>
    </div>
  )
};

export default Dashboard;