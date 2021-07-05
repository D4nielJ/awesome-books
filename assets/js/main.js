// Selectors

const formAddBook = document.querySelector("form");
const booksIndex = document.querySelector(".books-index");

// Object constructor

function CreateBook(title, author) {
  this.title = title;
  this.author = author;
}

const booksArray = [
  {
    title: "Harry Potter",
    author: "JK Rowling",
  },
  {
    title: "Lord of the Rings",
    author: "Tolkien",
  },
  {
    title: "Test",
    author: "Jhon Doe",
  },
  {
    title: "Another Test",
    author: "Jhon Doe",
  },
];

// Function insert books in the DOM

function addOneBookToDom(i) {
  const li = document.createElement("li");
  li.innerHTML = `<h2>${booksArray[booksArray.length - i].title}</h2>
    <h3>${booksArray[booksArray.length - i].author}</h3>
    <button type="button">Remove</button>`;
  li.classList.add("books-index__item");
  booksIndex.appendChild(li);
}

function appendCollectionToDom() {
  booksIndex.innerHTML = "";
  for (let i = booksArray.length; i > 0; i -= 1) {
    addOneBookToDom(i);
  }
}

// Functions to manage books from the collection

function addBook(e) {
  e.preventDefault();
  const newBook = new CreateBook();
  newBook.title = formAddBook.title.value;
  newBook.author = formAddBook.author.value;
  booksArray.push(newBook);
  addOneBookToDom(1);
}

function removeBook() {}

// Events

window.onload = appendCollectionToDom;
formAddBook.addEventListener("submit", addBook);
