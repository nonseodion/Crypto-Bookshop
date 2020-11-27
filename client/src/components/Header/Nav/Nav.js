import React from 'react';
import NavItem from "./NavItem/NavItem";

const nav = () => {
  return(
    <nav>
      <NavItem link="/">Market</NavItem>
      <NavItem link="/dashboard">Dashboard</NavItem>
    </nav>
  )
};

export default nav;