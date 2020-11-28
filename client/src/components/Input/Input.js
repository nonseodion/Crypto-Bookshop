import React from 'react';
//import classes from "./Input.module.css";


const Input = ({type, onChange, id, value}) => {
  return(
    <input type={type ? type : "text"}
      onChange={ onChange }
      id={id}
      value={value}>
    </input>
  )
};

export default Input;