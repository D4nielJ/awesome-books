import BooksCollection from './booksCollectionModule.js';

// Selectors

const bookIndexContainer = document.querySelector('#books-index-container');
const formAddContainer = document.querySelector('#form-add-container');
const contactContainer = document.querySelector('#contact-container');
const mobileNav = document.querySelector('.overlay-nav');
const mobileNavStyle = getComputedStyle(mobileNav);
const logo = document.querySelector('.logo-container');
const hamburgerTap = document.querySelector('.hamburguer-button__tap');
const hamburgerIcon = document.querySelectorAll('.hamburguer-button__icon span');
const navLinksMobile = document.querySelector('.overlay-nav__nav-list');
const copyrightMobile = document.querySelector('.overlay-nav__copyright');
const formAddBook = document.querySelector('form');
const booksIndex = document.querySelector('.books-index');
const bookCollection = new BooksCollection();
const navLinks = Array.from(document.querySelectorAll('.nav-list li'));
const dateDiv = document.querySelector('.date');

// Mobile Nav

const toggleMobileNav = () => {
  mobileNav.classList.toggle('overlay-nav--show');
  logo.classList.toggle('logo-container--mobile-overlay');
  hamburgerIcon.forEach(line => line.classList.toggle('hamburguer-button__icon--mobile-overlay'));
  navLinksMobile.classList.remove('overlay-nav__nav-list--overlay-transition');
  if (mobileNavStyle.width === '525px') {
    copyrightMobile.classList.add('d-none');
  }
};

hamburgerTap.addEventListener('mousedown', toggleMobileNav);

const onMobileNavTransition = () => {
  if (mobileNavStyle.width === '525px') {
    navLinksMobile.classList.add('overlay-nav__nav-list--overlay-transition');
    copyrightMobile.classList.remove('d-none');
  }
};

mobileNav.addEventListener("transitionend", onMobileNavTransition);

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
};

navLinks.forEach((li) => {
  li.addEventListener('mousedown', (e) => displayContainer(navLinks.indexOf(e.currentTarget)));
});

setInterval(() => {
  /* eslint-disable */
  const dateTime = luxon.DateTime;
  /* eslint-enable */
  dateDiv.innerHTML = dateTime.now().toLocaleString(dateTime.DATETIME_MED);
}, 1000);

// Front-end

const updateStorage = () => {
  localStorage.setItem(
    'storedBooksIndex',
    JSON.stringify(bookCollection.booksArray),
  );
  localStorage.setItem('storedBookIdCounter', bookCollection.bookIdCounter);
};

const removeBook = (bookCard, id) => {
  bookCollection.removeBookFromCollection(id);
  updateStorage();
  bookCard.remove();
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
  li.innerHTML = `<p class="books-index__item__title"><span>${newBook.title}</span> by ${newBook.author}</p>`;
  const removeButton = document.createElement('button');
  removeButton.setAttribute('type', 'button');
  removeButton.classList.add('books-index__item__remove-btn');
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
  formAddBook.reset();
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
