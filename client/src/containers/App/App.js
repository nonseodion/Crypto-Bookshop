import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Header from "../../components/Header/Header";
import Market from "../../components/Market/Market";
import Dashboard from "../../components/Dashboard/Dashboard";
import BookView from "../../components/BookView/BookView";
import Mint from "../Mint/Mint";
import "./App.css";

export let BookContext;

class App extends Component {
  state = {
    name: "",
    book: "",
    image: "",
    price: "",
    id: ""
  }

  onBookClick = async ({name, book, image, price, id}) => {
    await this.setState({name, book, image, price, id});
  }

  render(){
    BookContext = React.createContext(this.onBookClick);
    

    return(
      <>
        <Header />
        <BookContext.Provider value={this.onBookClick}>
          <Switch>
              <Route path="/book" render= {() => 
                <BookView 
                  name= {this.state.name}
                  book= {this.state.book}
                  image= {this.state.image} 
                  price= {this.state.price} 
                  id = {this.state.id}
                />
              }/>    
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/mint" component={Mint}/>
              <Route path="/" component={Market}/>
          </Switch>
        </BookContext.Provider>
      </>
    )
  }
}

export default App;


// const networkId = await web3.eth.net.getId();
// const deployedNetwork = SimpleStorageContract.networks[networkId];
// const instance = new web3.eth.Contract(
//   SimpleStorageContract.abi,
//   deployedNetwork && deployedNetwork.address,
// );