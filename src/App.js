import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import BookCreate from './components/BookCreate';
import BookList from './components/BookList';


function App() {
  const [books, setBooks] = useState([])

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:3001/books");
    
    setBooks(response.data);
  };

  useEffect(() => {
    fetchBooks();
  }, [])

  const editBookById = async (id, newTitle) => {
    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle
    });

    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return {...book, ...response.data}
      }

      return book;
    });
    
    setBooks(updatedBooks);
  }

  const deleteBookById = async (id) => {
    await axios.delete(`http://localhost:3001/books/${id}`);
    
    const updatedBooks = books.filter((book) => {
      return book.id !== id;
    });
    //FILTER DOESNT MODIFY THE ARRAY. IT GIVES BACK A NEW ARRAY SATISFYING THE FILTER CONDITIONS
    setBooks(updatedBooks)
  };

  const createBook = async (title) => {
    //when a user creates/edits/deletes a book, first update the API...
    const response = await axios.post("http://localhost:3001/books", {
      title
    });

    //... then update local data
    const updatedBooks = [
      ...books, 
      response.data
    ];
    setBooks(updatedBooks);
  }



  return (
    <div className="app">
      <h1>Reading List</h1>
      <BookList books={books} onDelete={deleteBookById} onEdit={editBookById}/>
      <BookCreate onCreate={createBook}/>
    </div>
  );
}

export default App;
