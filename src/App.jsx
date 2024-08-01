import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', { name, email });
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (id) => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, { name, email });
      console.log('Update response:', response.data);
      setUsers(users.map(user => (user.id === id ? response.data : user)));
      setName('');
      setEmail('');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id);
    } else {
      addUser();
    }
  };

  const handleEdit = (user) => {
    console.log("Editing user:",user);
    setName(user.name);
    setEmail(user.email);
    setEditingUser(user);
  };

  return (
    <div className='flex flex-wrap justify-around items-center gap-4'>
      <h1 className='font-bold text-xl '>CRUD Operations with Axios</h1>
      <form className='flex flex-wrap gap-4' onSubmit={handleSubmit}>
        <input className='border rounded-lg  bg-slate-100 p-3'
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input className='border rounded-lg  bg-slate-100 p-3'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className='border rounded-lg  bg-slate-300 p-3' type="submit">{editingUser ? 'Update' : 'Add'} User</button>
      </form>
      <ul className='flex flex-col'>
        {users.map(user => (
          <li className='flex my-2 items-center border justify-around' key={user.id}>
            {user.name} ({user.email})
            <button className='border rounded bg-slate-300 py-3 px-5' onClick={() => handleEdit(user)}>Edit</button>
            <button className='border rounded bg-red-500 p-3' onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
