import React from 'react';
import Book from '../Books/Book';
import BookCover from "../Books/2348163205216_status_09817370a5864c62a057f51bc1257fe9.jpg";
import classes from "./BookView.module.css";
import ListView from "./Views/ListView/ListView";
import DeListView from "./Views/DeListView/DeListView";
import Buy from "./Views/Buy/Buy";

const BookView = () => {
  return(
    <div className={classes["bookView"]}>
      <Book size="small" src={BookCover} name="Digital Is the Cash"/>
      {/* <ListView /> */}
      {/* <DeListView /> */}
      <Buy />
    </div>
  );
};

export default BookView;