import React from 'react';
import Button from "../../../Button/Button";
import Input from "../../../Input/Input";
import classes from "./ListView.module.css";

const List = () => {
  return(
    <div>
      <span className={classes["block-display"]}>
        <Input/>
        <Button color="normal">List</Button>
      </span>
        <Button color="red">Delete</Button>
    </div>
  )
};

export default List;