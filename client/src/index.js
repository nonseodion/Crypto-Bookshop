import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
import  { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter } from "react-router-dom";

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 3000;
  return library;
}

ReactDOM.render(
  <BrowserRouter>
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
  </BrowserRouter> , 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
