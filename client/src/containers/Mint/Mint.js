import React, {Component } from 'react';
import axios from "axios";

import Input from "../../components/Input/Input";
import classes from "./Mint.module.css";
import Button from "../../components/Button/Button";
import { upload } from "./Firebase";

//abis and dependencies
//import BookShop from "../../contracts/BookShop.json";
import OpenBooks from "../../contracts/OpenBooks.json"
import { Contract } from "@ethersproject/contracts";
import { AddressZero } from "@ethersproject/constants";
import { getWeb3ReactContext } from '@web3-react/core';


class Mint extends Component {
  state = {
    button: null,
    name: "",
    book: null,
    image: null,
    bookURL: "",
    imageURL: "",
    uploaded: false,
    bookTokenURI: ""
  };

  componentDidUpdate(){
    if(!this.state.uploaded) return;
    this.storeBookTokenURI();
    this.setState((prevState, props) => {
      return {
        uploaded: !prevState.uploaded
      }
    });
  }

  componentWillUnmount(){
    const { library } = this.context;
    library.removeAllListeners();
  }

  mint = () => {
    const { chainId, library, account } = this.context;
    const address = OpenBooks.networks["5777"].address;
    const abi = OpenBooks.abi;
    const contract = new Contract(address, abi, library.getSigner());
    const mintEvent = contract.filters.Transfer(AddressZero, account);
    library.on(mintEvent, (from, to, tokenId, event) => console.log(from, to, tokenId));
    return contract["mint"](this.state.bookTokenURI);
  }

  storeBookTokenURI = () => {
    console.log("storing");
    const bookInfo = {
      name: this.state.name,
      image: this.state.imageURL,
      book: this.state.bookURL
    };
    const bookTokenURI = `https://crypto-bookshop.firebaseio.com/${this.state.name.replaceAll(/\s+/g, "-")}.json`;
    axios.put(bookTokenURI, bookInfo)
      .then((res) => {
        this.changeMintStage("mint");
        this.setState({bookTokenURI});
      });
  }

  setBookURL = (url) => {
    console.log("this is the book url");
    let newUploaded;
    this.state.imageURL !== "" ? newUploaded = true : newUploaded = false;
    this.setState({bookURL: url, uploaded: newUploaded});
  }

  setImageURL = (url) => {
    console.log("this is the Image url");
    let newUploaded;
    this.state.bookURL !== "" ? newUploaded = true : newUploaded = false;
    this.setState({imageURL: url, uploaded: newUploaded});
  }

  onSelectFile = (event) => {
    const file = event.target.files[0];
    if(event.target.id === "book"){
      this.setState({book: file});
    }
    else{
      this.setState({image: file});
    }
    if(this.state.book !== null || 
      this.state.image !== null) {
        this.changeMintStage("upload");
    }
  }

  onUpload = (event) => {
    if(this.state.name === "") return;
    this.changeMintStage("uploading");
    upload(this.state.book, this.state.image, this.setBookURL, this.setImageURL);
  }

  onNameChange = (event) => {
    const name = event.target.value;
    this.setState({name});
  }

  changeMintStage = (mintStage) => {
    let title, color, onClick;
    switch(mintStage){
      case("upload"):
        [title, color, onClick] = ["Upload", "green", this.onUpload];   
        break;
      case("uploading"):
        [title, color, onClick] = ["Uploading...", "grey", null];
        break;
      case("mint"):
        [title, color, onClick] = ["Mint", "green", this.mint];
        break;
      default:
        [title, color, onClick] = [];   
    }
    this.setState({button:{title, color, onClick}})
  }

  render(){
    return(
      <div className={classes["mint"]}>
        <label>Name:</label>
        <Input onChange={this.onNameChange} value={this.state.name}/>
        <p>Book:</p>
        <Input onChange={this.onSelectFile} type="file" id="book"/>
        <p>Image</p>
        <Input onChange={this.onSelectFile} type="file" id="image"/>
        <p>
          {this.state.button ? 
            <Button 
              onClick={this.state.button.onClick} 
              color={this.state.button.color}>
                {this.state.button.title}
            </Button> : 
          ""
          }
        </p>
      </div>
    )
  };
};

const web3ReactContext = getWeb3ReactContext();
Mint.contextType = web3ReactContext;

export default Mint;