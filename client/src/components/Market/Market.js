import React, { useContext, useEffect, useState } from 'react';
import Book from "../Books/Book";
import classes from "./Market.module.css";
import { BookContext } from "../../containers/App/App";
import axios from "axios";

//contract and dependencies
import { useWeb3React } from "@web3-react/core";
import BookShop from "../../contracts/BookShop.json";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import useNetworkId from "../Hooks/useNetworkId";

const changeToEther = (prices) => {
  prices = prices.map( price => formatUnits(price.toString()));
  return prices;
}

const changeToNumbers = (nums) => {
  nums = nums.map( num => num.toString());
  return nums;
}

const Market = (props) => {

  const { library, chainId } = useWeb3React();
  const abi = BookShop.abi;
  const networkId = useNetworkId(chainId);
  

  let [onSale, setOnSale] = useState([]);

  useEffect(() => {
    if(library && onSale.length === 0){  
      if(!networkId) {
        console.log("Contracts not deployed on this network");
        return;
      }
      const address = BookShop.networks[networkId].address;
      const contract = new Contract(address, abi, library.getSigner());
      contract["getAllBooksOnSale"]().then((result) => {
        setBooks(result["bookIds"], result["bookPrices"], result["URIs"]);
      })
    }
  }); 

  const setBooks = (ids, prices, URIs) => {

    ids = changeToNumbers(ids);
    prices = changeToEther(prices);
    URIs = URIs.split(" ").slice(1);
    let booksOnSale = [];

    for(let i = 0; i<ids.length; i++){
      
      axios.get(URIs[i]).then((res) => {
        //let book = {id: ids[i], price: prices[i], ...res.data};
        let book = <Book key={ids[i]} 
          name = {res.data.name}
          image = {res.data.image}
          onClick={() => onClick({id: ids[i], price: prices[i], ...res.data})}
          price={prices[i]}
          />;
        booksOnSale.push(book);
        if(i+1 === ids.length) setOnSale([booksOnSale]);
      })
    }
  }

  const onBookClick = useContext(BookContext);
  const onClick = (...args) => {
    onBookClick(...args);
    props.history.push("/book");
  }


  return(
    <div className={classes["cover"]}>
      {onSale}
    </div>
  )
};

export default Market;