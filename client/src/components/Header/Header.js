import React from 'react';
import Nav from "./Nav/Nav";
import Wallet from "./Wallet/Wallet";
import classes from "./Header.module.css";

const Header = () => {
  return(
    <header className={classes.header}>
      <Nav />
      <Wallet />
    </header>
  )
};

export default Header;