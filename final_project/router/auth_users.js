const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let i=1;
let users = [{"username":"samioua","password":"123pwd"},{"username":"patrick","password":"134pwd"}];
// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}
// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
// Login endpoint
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      req.session.username = username;
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


// test
regd_users.get("/auth/username", (req, res) => {
  const username = req.session.username;  // Récupère le nom d'utilisateur de la session

  if (username) {
    return res.status(200).json({ message: `Utilisateur connecté : ${username}` });
  } else {
    return res.status(401).json({ message: "Aucun utilisateur n'est connecté." });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username; // Get the logged-in username from session
  const isbn = req.params.isbn; // Get the ISBN from the URL parameters
  const review = req.body.review; // Get the review from the request query

  // Check if the book exists in the collection
  if (books[isbn]) {
    let book = books[isbn]; // Get the book object for the given ISBN

    // Check if the user has already posted a review
    let userReviewKey = Object.keys(book.reviews).find(key => book.reviews[key].by === username);



    if (userReviewKey) {
      // If the user has already reviewed the book, update the review
      book.reviews[userReviewKey].review = review;
      return res.status(200).json({ message: "Review updated successfully", reviews: book.reviews });
    } else {
      // If the user hasn't reviewed the book yet, add a new review with a new ID
      let newReviewId = Object.keys(book.reviews).length + 1;
      book.reviews[newReviewId] = { review: review, by: username };
      return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
    }
  } else {
    // If the book is not found, return an error message
    return res.status(404).json({ message: "Book not found" });
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username=req.session.username;
  const isbn=req.params.isbn;
  
  if (books[isbn]) {
    let book = books[isbn]; // Get the book object for the given ISBN

    // Check if the user has already posted a review
    let userReviewKey = Object.keys(book.reviews).find(key => book.reviews[key].by === username);



    if (userReviewKey) {
      // If the user has already reviewed the book, update the review
      book.reviews[userReviewKey]= {};
      return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
    }


}else{
  return res.status(200).json({ message: "nothing to delete" });


}});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
