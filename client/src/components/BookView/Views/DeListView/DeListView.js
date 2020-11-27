import React from 'react';

import Input from "../../../Input/Input";
import Button from "../../../Button/Button";

import classes from "./DeListView.module.css";


const DeListView = () => {
  return(
    <div>
      ETH <span>88</span>
      <span className={classes["block-display"]}>
        <Input/>
        <Button color="normal">Change Price</Button>
      </span>
        <Button color="red">Delist</Button>
    </div>
  );
};

export default DeListView;