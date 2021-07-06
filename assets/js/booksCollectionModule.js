import Book from './bookModule.js';

export default class BooksCollection {
  constructor() {
    this.booksArray = [];
  }

  addBookToCollection = (title, author) => {
    const newBook = new Book(title, author);
    this.booksArray = this.booksArray.concat(newBook);
  };

  removeBookFromCollection = (title) => {
    const modifiedBooksArray = this.booksArray.filter((book) => book.title !== title);
    const index = this.booksArray.findIndex((book) => book.title === title);
    this.booksArray = modifiedBooksArray;
    return index;
  };
}
