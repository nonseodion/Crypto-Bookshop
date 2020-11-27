import React, { useContext, useEffect } from 'react';
import Button from "../Button/Button";
import Book from "../Books/Book";
import { BookContext } from "../../containers/App/App";
import BookCover from "../Books/2348163205216_status_09817370a5864c62a057f51bc1257fe9.jpg";

import classes from "./Dashboard.module.css";

//contracts and dependencies
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BookShop from "../../contracts/BookShop.json";


const Dashboard = (props) => {
  const onBookClick = useContext(BookContext);
  const onClick = (...args) => {
    onBookClick(...args);
    console.log(props);
    //props.history.push("/book");
  }

  const {account, library} = useWeb3React();

  useEffect(() => {
    
  }, )

  return(
    <div className={classes["dashboard"]}>
      <Button  color="normal" onClick={() => props.history.push("/mint")}>Mint Book</Button>
      <h4>My Books</h4>
      <div className={classes["books"]}>
        <Book size="small" src={BookCover} name="Digital Is the Cash" onClick={() => onClick(BookCover, "Digital Is the Cash", 1)}/>
      </div>
      <h4>On Sale</h4>
      <div className={classes["books"]}>
        <Book size="small" src={BookCover} name="Digital Is the Cash" onClick={() => onClick(BookCover, "Digital Is the Cash", 1)}/>
        <Book size="small" src={BookCover} name="Digital Is the Cash" onClick={() => onClick(BookCover, "Digital Is the Cash", 1)}/>
      </div>
    </div>
  )
};

export default Dashboard;