import React from 'react';
//import classes from "./Input.module.css";


const Input = ({type, onChange, id}) => {
  return(
    <input type={type ? type : "text"}
      onChange={ onChange }
      id={id}>
    </input>
  )
};

export default Input;