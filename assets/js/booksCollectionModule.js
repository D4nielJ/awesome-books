import Book from './bookModule.js';

export default class BooksCollection {
  constructor() {
    this.booksArray = [];
    this.bookIdCounter = 0;
  }

  addBookToCollection = (title, author) => {
    const newBook = new Book(title, author, this.bookIdCounter);
    this.booksArray = this.booksArray.concat(newBook);
    this.bookIdCounter++;
  };

  removeBookFromCollection = (id) => {
    this.booksArray = this.booksArray.filter((book) => book.bookid !== id);
  };
}
