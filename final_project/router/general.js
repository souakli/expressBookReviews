const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios=require('axios')

public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  if(username && password){
   
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    
  }
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books);
      
    },3000)})
  myPromise.then((books)=>{
    return  res.json({
      message: "Liste des livres récupérée avec succès",
      data: books
    });


  })
 
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  // Créer une promesse pour récupérer le livre correspondant à l'ISBN
  let myPromise = new Promise((resolve, reject) => {
    let book = books[isbn];

    // Vérifier si le livre existe
    if (book) {
      resolve(book);  // Résoudre la promesse avec le livre trouvé
    } else {
      reject(`Aucun livre trouvé avec l'ISBN ${isbn}`);  // Rejeter la promesse si le livre n'existe pas
    }
  });

  // Traiter la promesse
  myPromise
    .then((book) => {
      // Si le livre est trouvé, renvoyer les détails en JSON
      return res.json({
        message: "Détails du livre récupérés avec succès",
        data: book
      });
    })
    .catch((error) => {
      // Si une erreur survient (par ex : livre non trouvé), renvoyer un message d'erreur
      return res.status(404).json({
        error: error  // Le message d'erreur est celui défini dans reject()
      });
    });
});

  
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;

  // Créer une promesse pour chercher les livres par auteur
  let myPromise = new Promise((resolve, reject) => {
    let foundBooks = [];

    Object.keys(books).forEach(element => {
      let book = books[element];
      if (book.author === author) {
        foundBooks.push(book);  // Ajouter le livre correspondant à l'auteur
      }
    });

    // Si des livres ont été trouvés, les résoudre
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("Aucun livre trouvé pour l'auteur " + author);
    }
  });

  myPromise
    .then((books) => {
      return res.json({
        message: `Livres de l'auteur ${author} récupérés avec succès`,
        data: books
      });
    })
    .catch((error) => {
      return res.status(404).json({
        message: error
      });
    });
});


public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
// Créer une promesse pour chercher les livres par titre
  let myPromise = new Promise((resolve, reject) => {
    let foundBooks = [];

    Object.keys(books).forEach(index => {
      let book = books[index];
      if (book.title === title) {
        foundBooks.push(book);  // Ajouter le livre correspondant au titre
      }
    });

    // Si des livres ont été trouvés, les résoudre
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("Aucun livre trouvé avec le titre " + title);
    }
  });
  myPromise
    .then((books) => {
      return res.json({
        message: `Livres trouvés avec le titre "${title}" récupérés avec succès`,
        data: books
      });
    })
    .catch((error) => {
      return res.status(404).json({
        message: error
      });
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=req.params.isbn;
  Object.keys(books).forEach(index=>{
    let book=books[index];
    if(index===isbn){
      return res.send(JSON.stringify(book.reviews));   }
  })
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
