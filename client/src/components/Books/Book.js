import React from 'react';
import classes from "./Book.module.css";

const Book = ({onClick, src, name, size}) => {


  return(
    <div className={classes["book"]} onClick={onClick}>
      <img className={`${classes["picture"]} ${classes[size]}`} alt="Crypto Book" src={src}></img>
      <span className={classes["name"]}>{name}</span>
    </div>
  )
};

export default Book;