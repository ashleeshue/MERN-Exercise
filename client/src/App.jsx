import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap'; // Import Bootstrap components

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const backendUrl = 'http://localhost:5050/api/todos';

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(backendUrl);
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleInputChange = (event) => {
    setNewTodoText(event.target.value);
  };

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleCompleted = async (id) => {
    try {
      const updatedTodo = { ...todos.find((todo) => todo._id === id) };
      updatedTodo.completed = !updatedTodo.completed;

      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="App">
      <Container>
        <h1 className="text-center mt-5 mb-4">Todo List</h1>
        <Row className="mb-3">
          <Col xs={8}>
            <Form.Control type="text" value={newTodoText} onChange={handleInputChange} placeholder="Enter new todo" />
          </Col>
          <Col xs={4}>
            <Button onClick={handleAddTodo} variant="primary" className="w-100">Add Todo</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <ul className="list-group">
              {todos.map((todo) => (
                <li key={todo._id} className={`list-group-item ${todo.completed ? 'completed' : ''}`}>
                  <span>{todo.text}</span>
                  <div className="buttons">
                    <Button onClick={() => handleToggleCompleted(todo._id)} variant={todo.completed ? 'success' : 'outline-success'} className="me-2">Toggle</Button>
                    <Button onClick={() => handleDeleteTodo(todo._id)} variant="danger">Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
