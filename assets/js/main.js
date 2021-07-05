// Selectors

const formAddBook = document.querySelector("form");
const submitButton = document.querySelector("form > button");

// Object constructor

function CreateBook(title, author) {
  this.title = title;
  this.author = author;
}

const booksArray = [];

function addBook(e) {
  e.preventDefault();
  const newBook = new CreateBook();
  newBook.title = formAddBook.title.value;
  newBook.author = formAddBook.author.value;
  booksArray.push(newBook);
}

// Events

formAddBook.addEventListener("submit", addBook);
