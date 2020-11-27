import React from 'react';
import Button from "../../../Button/Button";
import classes from "./Buy.module.css";

const Buy = () => {
  return(
    <div className={classes["about"]}>
      <span className={classes["price"]}>ETH 88</span>
      <Button color="green">Buy</Button>
    </div>
  );
};

export default Buy;