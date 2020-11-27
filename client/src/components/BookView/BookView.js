import React from 'react';
import Book from '../Books/Book';
import BookCover from "../Books/2348163205216_status_09817370a5864c62a057f51bc1257fe9.jpg";
import classes from "./BookView.module.css";
import ListView from "./Views/ListView/ListView";
import DeListView from "./Views/DeListView/DeListView";
import Buy from "./Views/Buy/Buy";

const BookView = ({name, book, image, price, id}) => {
  return(
    <div className={classes["bookView"]}>
      <Book image={image} name={name}/>

      {/* <ListView 
        id = {id}
        book = {book}
      /> */}
      {/* <DeListView
        id = {id}
        price = {id}
        book = {book}
      /> */}
      <Buy 
        id = {id}
        book = {book}
        price = {price}
      />
    </div>
  );
};

export default BookView;