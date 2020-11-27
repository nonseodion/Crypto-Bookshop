import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage"
import "firebase/database"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGRaptrRp9LmTifF_JQgOdkkj6ct_DD4Y",
  authDomain: "crypto-bookshop.firebaseapp.com",
  databaseURL: "https://crypto-bookshop.firebaseio.com",
  projectId: "crypto-bookshop",
  storageBucket: "crypto-bookshop.appspot.com",
  messagingSenderId: "660111674820",
  appId: "1:660111674820:web:2bfe916521cc94694be891",
  measurementId: "G-XB692RTW2R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
const storageRef = storage.ref();
const booksRef = storageRef.child("books")

export const upload = (book, image, setBookURL, setImageURL) => {
  const bookRef = booksRef.child(`${book.name}`);
  const imageRef = booksRef.child(`${image.name}`);
  
  bookRef.put(book).then(function(snapshot) {
    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('Book available at', downloadURL);
      setBookURL(downloadURL);
    });
  });

  imageRef.put(image).then(function(snapshot) {
    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('Image available at', downloadURL);
      setImageURL(downloadURL);
    });
  });
}