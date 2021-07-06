import BooksCollection from './booksCollectionModule.js';

// Selectors

const formAddBook = document.querySelector('form');
const booksIndex = document.querySelector('.books-index');
const bookCollection = new BooksCollection();

const updateStorage = () => {
  localStorage.setItem('storedBooksIndex', JSON.stringify(bookCollection.booksArray));
};

const removeBook = (bookTitle) => {
  const index = bookCollection.removeBookFromCollection(bookTitle);
  updateStorage();
  const bookDom = booksIndex.children[index];
  bookDom.remove();
};

const addEventListenerToRemoveBtn = (button) => {
  button.addEventListener('click', (e) => removeBook(e.target.parentNode.firstChild.textContent));
};

const addOneBookToDom = (i) => {
  const li = document.createElement('li');
  li.innerHTML = `<h2>${bookCollection.booksArray[bookCollection.booksArray.length - i].title}</h2>
    <h3>${bookCollection.booksArray[bookCollection.booksArray.length - i].author}</h3>`;
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.setAttribute('type', 'button');
  addEventListenerToRemoveBtn(removeButton);
  li.appendChild(removeButton);
  li.classList.add('books-index__item');
  booksIndex.appendChild(li);
};

// Local Storage

const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException
      // everything except Firefox
      && (e.code === 22
        // Firefox
        || e.code === 1014
        // test name field too, because code might not be present
        // everything except Firefox
        || e.name === 'QuotaExceededError'
        // Firefox
        || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      // acknowledge QuotaExceededError only if there's something already stored
      && storage
      && storage.length !== 0
    );
  }
};

const loadStorage = (storedBooksIndex) => {
  storedBooksIndex = JSON.parse(storedBooksIndex);
  storedBooksIndex.forEach((book) => {
    bookCollection.booksArray = bookCollection.booksArray.concat(book);
    addOneBookToDom(1);
  });
};

// Functions to manage books from the collection

const addBook = (e) => {
  e.preventDefault();
  bookCollection.addBookToCollection(formAddBook.title.value, formAddBook.author.value);
  updateStorage();
  addOneBookToDom(1);
};

const load = () => {
  if (storageAvailable('localStorage')) {
    if (localStorage.length !== 0) {
      loadStorage(localStorage.getItem('storedBooksIndex'));
    }
  }
};

// Events

window.onload = load;
formAddBook.addEventListener('submit', addBook);
