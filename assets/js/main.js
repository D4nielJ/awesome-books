import BooksCollection from './booksCollectionModule.js';

// Selectors

const bookIndexContainer = document.querySelector('#books-index-container');
const formAddContainer = document.querySelector('#form-add-container');
const contactContainer = document.querySelector('#contact-container');
const formAddBook = document.querySelector('form');
const booksIndex = document.querySelector('.books-index');
const bookCollection = new BooksCollection();
const navLinks = Array.from(document.querySelectorAll('.nav-list li'));
const dateDiv = document.querySelector('.date');

// Desktop Nav

const displayContainer = (index) => {
  if (index === 0) {
    formAddContainer.classList.add('d-none');
    contactContainer.classList.add('d-none');
    bookIndexContainer.classList.remove('d-none');
  } else if (index === 1) {
    formAddContainer.classList.remove('d-none');
    contactContainer.classList.add('d-none');
    bookIndexContainer.classList.add('d-none');
  } else {
    formAddContainer.classList.add('d-none');
    contactContainer.classList.remove('d-none');
    bookIndexContainer.classList.add('d-none');
  }
}

navLinks.forEach((li) => {
  li.addEventListener('mousedown', (e) => displayContainer(navLinks.indexOf(e.currentTarget)));
});

// Date

const getTime = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
};

dateDiv.textContent = `${getTime()}`

// Front-end

const updateStorage = () => {
  localStorage.setItem(
    'storedBooksIndex',
    JSON.stringify(bookCollection.booksArray),
  );
  localStorage.setItem('storedBookIdCounter', bookCollection.bookIdCounter);
};

const removeBook = (bookCard, id) => {
  console.log('li: ', bookCard);
  console.log('id: ', id);
  bookCollection.removeBookFromCollection(id);
  updateStorage();
  bookCard.remove();
  styleTable();
};

const addEventListenerToRemoveBtn = (button) => {
  button.addEventListener('click', (e) => removeBook(
    e.currentTarget.parentNode,
    parseInt(e.currentTarget.parentNode.dataset.bookid, 10),
  ));
};

const addOneBookToDom = (i) => {
  const li = document.createElement('li');
  const newBook = bookCollection.booksArray[bookCollection.booksArray.length - i];
  li.innerHTML = `<p class="books-index__title"><span>${newBook.title}</span> by ${newBook.author}</p>`;
  const removeButton = document.createElement('button');
  removeButton.setAttribute('type', 'button');
  removeButton.classList.add('books-index__remove-btn');
  removeButton.innerHTML = '<i class="far fa-trash-alt"></i><span class="only-desktop">Remove</span>';
  addEventListenerToRemoveBtn(removeButton);
  li.appendChild(removeButton);
  li.classList.add('books-index__item');
  li.setAttribute('data-bookid', `${newBook.bookid}`);
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
    formAddBook.author.value,
  );
  updateStorage();
  addOneBookToDom(1);
  displayContainer(0);
};

const load = () => {
  if (storageAvailable('localStorage')) {
    if (localStorage.length !== 0) {
      const storedBooksIndex = localStorage.getItem('storedBooksIndex');
      const storedBookIdCounter = parseInt(
        localStorage.getItem('storedBookIdCounter'),
        10,
      );
      loadStorage(storedBooksIndex, storedBookIdCounter);
    }
  }
};

// Events

window.onload = load;
formAddBook.addEventListener('submit', addBook);
