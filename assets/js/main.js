import BooksCollection from "./booksCollectionModule.js";

// Selectors

const formAddBook = document.querySelector("form");
const booksIndex = document.querySelector(".books-index");
const bookCollection = new BooksCollection();

const updateStorage = () => {
  localStorage.setItem(
    "storedBooksIndex",
    JSON.stringify(bookCollection.booksArray)
  );
  localStorage.setItem("storedBookIdCounter", bookCollection.bookIdCounter);
};

const removeBook = (bookCard, id) => {
  bookCollection.removeBookFromCollection(id);
  updateStorage();
  bookCard.remove();
  styleTable();
};

const addEventListenerToRemoveBtn = (button) => {
  button.addEventListener("click", (e) =>
    removeBook(
      e.target.parentNode,
      parseInt(e.target.parentNode.dataset.bookid, 10)
    )
  );
};

const addOneBookToDom = (i) => {
  const li = document.createElement("li");
  if (bookCollection.booksArray.length % 2 === 0) {
    li.classList.add("books-index__item--alt");
  }
  const newBook =
    bookCollection.booksArray[bookCollection.booksArray.length - i];
  li.innerHTML = `<p class="books-index__title"><span>${newBook.title}</span> by ${newBook.author}</p>`;
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.setAttribute("type", "button");
  addEventListenerToRemoveBtn(removeButton);
  li.appendChild(removeButton);
  li.classList.add("books-index__item");
  li.setAttribute("data-bookid", `${newBook.bookid}`);
  booksIndex.appendChild(li);
};

// Local Storage

const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

const loadStorage = (storedBooksIndex, storedBookIdCounter) => {
  storedBooksIndex = JSON.parse(storedBooksIndex);
  storedBooksIndex.forEach((book) => {
    bookCollection.booksArray = bookCollection.booksArray.concat(book);
    addOneBookToDom(1);
  });
  bookCollection.bookIdCounter = storedBookIdCounter;
};

// Functions to manage books from the collection

const addBook = (e) => {
  e.preventDefault();
  bookCollection.addBookToCollection(
    formAddBook.title.value,
    formAddBook.author.value
  );
  updateStorage();
  addOneBookToDom(1);
  styleTable();
};

const load = () => {
  if (storageAvailable("localStorage")) {
    if (localStorage.length !== 0) {
      const storedBooksIndex = localStorage.getItem("storedBooksIndex");
      const storedBookIdCounter = parseInt(
        localStorage.getItem("storedBookIdCounter"),
        10
      );
      loadStorage(storedBooksIndex, storedBookIdCounter);
    }
  }
  styleTable();
};

// Front-end

const styleTable = () => {
  if (bookCollection.booksArray.length === 0) {
    booksIndex.classList.remove("books-index--border");
  } else {
    booksIndex.classList.add("books-index--border");
  }
};

// Events

window.onload = load;
formAddBook.addEventListener("submit", addBook);
