// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ItemManagementSystem() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', author: '' ,genre: '' ,publication: '' ,isbna: '' });
  const [updatedItem, setUpdatedItem] = useState({ name: '', author: '' ,genre: '' ,publication: '' ,isbna: '' });
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:7000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.author || !newItem.genre || !newItem.publication || !newItem.isbna) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/items', newItem);
      setItems([...items, response.data]);
      setNewItem({ name: '', author: '' ,genre: '' ,publication: '' ,isbna: '' });
      setFormError('');
    } catch (error) {
      console.error('Error adding item:', error.message);
      setFormError('Error adding item.');
    }
  };

  const handleUpdateItem = async (id) => {
    if (!updatedItem.name || !updatedItem.author || !updatedItem.genre || !updatedItem.publication || !updatedItem.isbna) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:7000/items/${id}`, updatedItem);
      setItems(items.map((item) => (item._id === id ? response.data : item)));
      setUpdatedItem({ name: '', author: '' ,genre: '' ,publication: '' ,isbna: '' });
      setSelectedItemId(null);
      setFormError('');
    } catch (error) {
      console.error('Error updating item:', error.message);
      setFormError('Error updating item.');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error.message);
      setFormError('Error deleting item.');
    }
  };

  const handleSelectItemForUpdate = (item) => {
    setUpdatedItem({ name: item.name, author: item.author ,genre: item.genre ,publication: item.publication ,isbna: item.isbna });
    setSelectedItemId(item._id);
    setFormError('');
  };

  return (
    <div className="container">
      <h1>Book Management System</h1>
      {formError && <div className="alert alert-danger mt-3">{formError}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Name"
          className="mr-2"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          className="mr-2"
          value={newItem.author}
          onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          className="mr-2"
          value={newItem.genre}
          onChange={(e) => setNewItem({ ...newItem, genre: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Publication year"
          className="mr-2"
          value={newItem.publication}
          onChange={(e) => setNewItem({ ...newItem, publication: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="ISBNA"
          className="mr-2"
          value={newItem.isbna}
          onChange={(e) => setNewItem({ ...newItem, isbna: e.target.value })}
          required
        />
        <button className="btn btn-primary" onClick={handleAddItem}>
          Add Item
        </button>
      </div>
      <ul className="list-group">
        {items.map((item) => (
          <li key={item._id} className="list-group-item">
            {selectedItemId === item._id ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.name}</h5>
                  <p>{`${item.author}, ${item.genre}, ${item.publication},${item.isbna}`}</p>
                </div>
                <div>
                <input
                    type="text"
                    placeholder="Name"
                    className="mr-2"
                    value={updatedItem.name}
                    onChange={(e) =>  setUpdatedItem({ ...updatedItem, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    className="mr-2"
                    value={updatedItem.author}
                    onChange={(e) =>  setUpdatedItem({ ...updatedItem, author: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Genre"
                    className="mr-2"
                    value={updatedItem.genre}
                    onChange={(e) =>  setUpdatedItem({ ...updatedItem, genre: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Publication year"
                    className="mr-2"
                    value={updatedItem.publication}
                    onChange={(e) =>  setUpdatedItem({ ...updatedItem, publication: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="ISBNA"
                    className="mr-2"
                    value={updatedItem.isbna}
                    onChange={(e) =>  setUpdatedItem({ ...updatedItem, isbna: e.target.value })}
                    required
                  />
                  
                  <button className="btn btn-warning mr-2" onClick={() => handleUpdateItem(item._id)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => setSelectedItemId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                <h5>{item.name}</h5>
                  <p>{`${item.author}, ${item.genre}, ${item.publication},${item.isbna}`}</p>
                </div>
                <div>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleSelectItemForUpdate(item)}
                  >
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDeleteItem(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemManagementSystem;
