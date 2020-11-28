import React from 'react';
import classes from "./Book.module.css";
import { EtherSymbol } from '@ethersproject/constants';

const Book = ({onClick, name, image, price, args}) => {


  return(
    <div className={classes["book"]} onClick={() => onClick(args)}>
      <img className={`${classes["picture"]} ${classes["small"]}`} 
        alt="Crypto Book"
        src={image}
        ></img>
      <span className={classes["name"]}>{name}</span>
      {price ? <p>{EtherSymbol} {price}</p> : ""}
    </div>
  )
};

export default Book;