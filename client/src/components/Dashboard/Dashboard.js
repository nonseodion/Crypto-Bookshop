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
import { formatUnits, formatEther } from "@ethersproject/units";
import useSWR from "swr";
import fetcher from "../../Fetcher";
import { EtherSymbol, AddressZero } from "@ethersproject/constants";
import useNetworkId from "../Hooks/useNetworkId";

const changeToEther = (prices) => {
  prices = prices.map( price => formatUnits(price.toString()));
  return prices;
}

const changeToNumbers = (nums) => {
  nums = nums.map( num => num.toString());
  return nums;
}

let bookShopAddress;

const Dashboard = (props) => {
  const onBookClick = useContext(BookContext);
  const onClick = (args) => {
    onBookClick(args);
    props.history.push("/book");
  }

  const {account, library, chainId} = useWeb3React();
  
  const abi = BookShop.abi;
  const networkId = useNetworkId(chainId);
  const { data: balance, mutate } = useSWR([bookShopAddress, "balances", account], fetcher(library, abi));
  
  
  let [[onSale, notOnSale], setSales] = useState([[], []]);
  let [viewer, setViewer] = useState(AddressZero);

  useEffect(() => {
    
    if(library && viewer !== account){
      if(!networkId) {
        console.log("Contracts not deployed on this network");
        return;
      }
      bookShopAddress = BookShop.networks[networkId].address;
      const contract = new Contract(bookShopAddress, abi, library.getSigner());
      contract["getBooks"](account).then((result) => {
        setBooks(result["bookIds"], result["bookPrices"], result["URIs"]);
        setViewer(account);
      })
    }

    if(library){
      const contract = new Contract(bookShopAddress, abi, library.getSigner());
      const withdrawEvent = contract.filters.Withdraw(account);
      library.once(withdrawEvent, () => {
        mutate(undefined, true);
      });
    }
  });

  
  
  const setBooks = (ids, prices, URIs) => {
    ids = changeToNumbers(ids);
    prices = changeToEther(prices);
    URIs = URIs.split(" ").slice(1);
    let [booksOnSale, booksNotOnSale] = [[], []];
    
    for(let i = 0; i<ids.length; i++){
      axios.get(URIs[i]).then((res) => {
        let book = <Book key={ids[i]} 
          name = {res.data.name}
          image = {res.data.image}
          args = {{id: ids[i], price: prices[i], ...res.data}}
          onClick={onClick}
          />;
        if(prices[i] > 0){
          booksOnSale.push(book);
        }
        else{
          booksNotOnSale.push(book);   
        }
        
        if(++i === ids.length) setSales([booksOnSale, booksNotOnSale]);
      })
    }
    if(ids.length === 0) setSales([], []);
  }

  const withdraw = () => {
    if(library){
      const contract = new Contract(bookShopAddress, abi, library.getSigner());
      contract["withdraw"]();
    }
  }

  return(
    <div className={classes["dashboard"]}>
      <Button  color="normal" onClick={() => props.history.push("/mint")}>Mint Book</Button>
      <p>
        Balance: {EtherSymbol}  {balance ? formatEther(balance) : ""} &nbsp;<Button color="green" onClick={withdraw}>Withdraw</Button>
      </p>
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