import React, { useEffect, useState } from 'react'
import styles from '../styles/pages/manger.module.css'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deleteUser } from 'firebase/auth'
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import Interests from '@/../../public/data/interests.json'



export default function Manger() {

    const [user, loading, error] = useAuthState(auth)
    const [allUsersData, setAllUsersData] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [errors, setErrors] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);

    const [newUserData, setNewUserData] = useState({
      id: '',
      name: '',
      email: '',
      level: '',
      interests: '',
    });



    const handleEditUser = async (userId) => {
      try {
        // Set the userId in state to indicate that we are editing this user
        setEditingUserId(userId);
      } catch (error) {
        console.error('Error initiating user edit:', error);
      }
    };
  
    const handleSaveEdit = async (userId, updatedUserData) => {
      try {
        // Update the user's data in the table
        const updatedUsers = allUsersData.map((user) =>
          user.id === userId ? { ...user, ...updatedUserData } : user
        );
        setAllUsersData(updatedUsers);
  
        // Update the user's data in the database
        await updateDoc(doc(db, 'users', userId), updatedUserData);
        console.log('User data updated in the database successfully.');
  
        // Clear the editing state
        setEditingUserId(null);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };
  
    const renderTableCell = (user, column) => {
      // If the user is being edited, show an input field; otherwise, show the value
      if (user.id === editingUserId) {
        return (
          <input
            type="text"
            value={user[column]}
            onChange={(e) => handleSaveEdit(user.id, { [column]: e.target.value })}
          />
        );
      }
      return user[column];
    };

    const handleDeleteUser = async (userId) => {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete your account forever? This action is irreversible.'
      )
  
      // If user canceled delete, return
      if (!confirmDelete) return
      const userRef = doc(db, 'users', userId);
      try {
        // Remove the user from the table
        const updatedUsers = allUsersData.filter((user) => user.id !== userId);
        setAllUsersData(updatedUsers);
        // Delete the user from the database
        await deleteDoc(userRef);
        console.log('User deleted from the database successfully.');
      fetchAllUsers();

      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    
  const handleAddUser = async () => {
    setEmailError('')
    setErrors('')
    try {
      // Validate input data before adding
      if (
        !newUserData.id &&
        !newUserData.name &&
        !newUserData.email &&
        !newUserData.level &&
        !newUserData.interests
        ){
          setErrors('נא למלא את כל השדות')
          return
        } 
        if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
          setEmailError('האימייל שהתקבל לא בתבנית הנכונה');
          return;
        }
          if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
            setEmailError('האימייל שהתקבל לא בתבנית הנכונה');
            return;
          }
          // Add the new user to the database
        const newUserRef = await addDoc(collection(db, 'users'), newUserData);

        // Add the new user to the local state
        setAllUsersData([...allUsersData, { id: newUserRef.id, ...newUserData }]);
        
        // Clear the input form
        setNewUserData({
          id: '',
          name: '',
          email: '',
          level: [],
          interests: [],
        });
        console.log(selectedInterests)

        console.log('User added to the database successfully.');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
     
  
  
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    
    // Check if the option is already selected
    if (!selectedInterests.includes(selectedOption)) {
      // Add the selected option to the array
      setSelectedInterests([...selectedInterests, selectedOption]);
    }
  };
  
  const handleRemoveInterest = (interest) => {
    // Remove the selected interest from the array
    const updatedInterests = selectedInterests.filter((item) => item !== interest);
    setSelectedInterests(updatedInterests);
  };

  const fetchAllUsers = async () => {
    try {
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);

      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllUsersData(usersData);
      console.log(allUsersData)
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };
  
  useEffect(() => {
    // Call the async function
    fetchAllUsers();
  }, []); // Run this effect only once when the component mounts
  


  return (
    
    <div className={styles["App"]}>
      
          {/* <h2>All Users Table</h2> */}
          <Table striped bordered hover className={styles["table"]}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Difficulty</th>
            <th>Interests</th>
            <th></th>
            <th></th>
            <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Add User
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <label>ID: </label>
            <input
              type="text"
              value={newUserData.id}
              onChange={(e) => setNewUserData({ ...newUserData, id: e.target.value })}
            />
        <label>Name: </label>
            <input
              type="text"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            />
        <label>Email: </label>
            <input
              type="text"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            />
            <p style={{ color: 'red' }}>{emailError}</p>

        <label>Level: </label>
            <br />
                <select>
                   <option></option>
                   <option>easy</option>
                   <option>hard</option>
                    
                </select>
                <br /> 
        <label>Interests: </label>
        {/* <br />
                <select>  
                   {Interests.map((interest, i) => <option key={i}>{interest}</option>)}                    
                </select>
                <br /> */}
                 <select value="" onChange={handleSelectChange}>
        <option value="" disabled>Select an interest</option>
        {Interests.map((interest, index) => (
          <option key={index} value={interest}>
            {interest}
          </option>
        ))}
      </select>

      <p>Selected Interests:</p>
      <ul>
        {selectedInterests.map((interest, index) => (
          <li key={index}>
            {interest}
            <button onClick={() => handleRemoveInterest(interest)}>Remove</button>
          </li>
        ))}
      </ul>

{/* 
            <input
              type="text"
              value={newUserData.interests}
              onChange={(e) => setNewUserData({ ...newUserData, interests: e.target.value })}
            /> */}
            <br/>
        <button onClick={handleAddUser}>Add User</button>
        <p style={{ color: 'red' }}>{error}</p>

        

      </Dropdown.Menu>
    </Dropdown>

            {/* Add more columns as needed */}
          </tr>
        </thead>
        
        <tbody>
          {allUsersData.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{renderTableCell(user, 'email')}</td>
              <td>{renderTableCell(user, 'name')}</td>
              <td>
              {Array.isArray(user.difficulty)
                    ? user.difficulty.map((difficulty, i) => <option key={i}>{difficulty}</option>)
                    : renderTableCell(user, 'difficulty')}
                
                </td>
              

              <td>
                <select>
                  {Array.isArray(user.interests)
                    ? user.interests.map((interest, i) => <option key={i}>{interest}</option>)
                    : null}
                </select>
              </td>
              <td>
                {user.id === editingUserId ? (
                  <button onClick={() => handleSaveEdit(user.id, {})}>Save</button>
                ) : (
                  <button onClick={() => handleEditUser(user.id)}>Edit</button>
                )}
              </td>
              <td><button onClick={() => handleDeleteUser(user.id)}>Delete</button></td>
            </tr>

          ))}
        </tbody>
        </Table>

      
        </div>
    


  )
}
// נשאר לסדר את הרמה ותחומי עיניין שיוצגו בטבלה נורמלי