import Book from './bookModule.js';

export default class BooksCollection {
  constructor() {
    this.booksArray = [];
  }

  addBookToCollection = (title, author) => {
    const newBook = new Book(title, author);
    this.booksArray.push(newBook);
  };

  removeBookFromCollection = (title) => {
    const book = this.booksArray.filter((book) => book.title === title);
    const index = this.booksArray.indexOf(book[0]);
    this.booksArray.splice(index, 1);
    return index;
  };
}
