import React from 'react';
import classes from "./NavItem.module.css"
import { NavLink } from "react-router-dom";

const navItem = ({children: title, link}) => {
  return(
    <NavLink 
      to={link} 
      className={classes["nav-item"]}
      activeClassName={classes["active"]}
      exact>{title}</NavLink>
  )
};

export default navItem;