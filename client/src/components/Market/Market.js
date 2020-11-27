import React, { useContext } from 'react';
import Book from "../Books/Book";
import classes from "./Market.module.css";
import BookCover from "../Books/2348163205216_status_09817370a5864c62a057f51bc1257fe9.jpg";
import { BookContext } from "../../containers/App/App";


const Market = (props) => {

  const onBookClick = useContext(BookContext);
  const onClick = (...args) => {
    onBookClick(...args);
    props.history.push("/book");
  }


  return(
    <div className={classes["cover"]}>
      <Book size="small" src={BookCover} name="Digital Is the Cash" onClick={() => onClick(BookCover, "Digital Is the Cash", 1)}/>
      <Book size="small" src={BookCover} name="Digital Is the Cash" onClick={() => onClick(BookCover, "Digital Is the Cash", 1)}/>
    </div>
  )
};

export default Market;