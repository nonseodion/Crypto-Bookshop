import React from 'react';
import classes from "./Button.module.css";

const Button = ({children: title, color, onClick}) => {
  return(
    <button className={`${classes[color]} ${classes["button"]}`} onClick={onClick}>
      {title}
    </button>
  )
};

export default Button;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               