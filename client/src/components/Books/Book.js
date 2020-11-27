import React from 'react';
import classes from "./Book.module.css";

const Book = ({onClick, name, image}) => {


  return(
    <div className={classes["book"]} onClick={onClick}>
      <img className={`${classes["picture"]} ${classes["small"]}`} 
        alt="Crypto Book"
        src={image}
        ></img>
      <span className={classes["name"]}>{name}</span>
    </div>
  )
};

export default Book;