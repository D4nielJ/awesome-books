// Selectors

let booksArray = [];
const formAddBook = document.querySelector('form');
const getBooksIndex = () => document.querySelector('.books-index');

// Object constructor

function CreateBook(title, author) {
  this.title = title;
  this.author = author;
}

// Function insert books in the DOM

function removeBook(bookTitle) {
  console.log(booksArray);
  const book = booksArray.filter((book) => book.title === bookTitle);
  const index = booksArray.indexOf(book[0]);
  booksArray.splice(index, 1);
  updateStorage();
  const booksIndex = getBooksIndex();
  console.log(index);
  console.log(booksIndex.childNodes);
  const bookDom = booksIndex.childNodes[index];
  console.log(bookDom);
  bookDom.remove();
}

function addOneBookToDom(i) {
  const li = document.createElement('li');
  li.innerHTML = `<h2>${booksArray[booksArray.length - i].title}</h2>
    <h3>${booksArray[booksArray.length - i].author}</h3>`;
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.setAttribute('type', 'button');
  addEventListenerToRemoveBtn(removeButton);
  li.appendChild(removeButton);
  li.classList.add('books-index__item');
  const booksIndex = getBooksIndex();
  booksIndex.appendChild(li);
}

// Functions to manage books from the collection

function addBook(e) {
  e.preventDefault();
  const newBook = new CreateBook();
  newBook.title = formAddBook.title.value;
  newBook.author = formAddBook.author.value;
  booksArray.push(newBook);
  updateStorage();
  addOneBookToDom(1);
}

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
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};

const updateStorage = () => {
  localStorage.setItem('storedBooksIndex', JSON.stringify(booksArray));
};

const loadStorage = (storedBooksIndex) => {
  storedBooksIndex = JSON.parse(storedBooksIndex);
  storedBooksIndex.forEach((book) => {
    booksArray.push(newBook);
    addOneBookToDom(1);
  });
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
const addEventListenerToRemoveBtn = (button) => {
  button.addEventListener('click', (e) =>
    removeBook(e.target.parentNode.firstChild.textContent)
  );
};
