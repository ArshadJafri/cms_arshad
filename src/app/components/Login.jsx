"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmail, setRole, setUserName } from '../../redux/userSlice'
import { useRouter } from 'next/navigation';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Login.css';

const Login = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUserName, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();


  const handleClickOpen = () => {
    setOpen(true);
  };

  
  const handleClose = () => {
    setOpen(false);
    setUsername('');
    setPassword('');
    setNewEmail('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
  };
  const validateTheFields = ()=>{
    console.log('Inside Validate Fields');
    console.log(newUserName, newPassword, newEmail, confirmPassword);
    if(newUserName.length == 0 || newPassword.length ==0 || newEmail.length ==0){
      alert('Please Enter Required Fields!!');
      return false;
    } 
    if(newPassword != confirmPassword){
      alert('Password and Confirm Password should match!!');
      return false;
    }
    if(!(newEmail.includes('@') && newEmail.includes('.'))){
      alert('Please Enter Valid Email!!');
      return false;
    }
    return true;

  }
  const handleSignUp = async() =>{
    const isValid = validateTheFields();
    if(isValid){
      const response = await fetch('api/users/signup', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          'username': newUserName,
          'email': newEmail,
          'password': newPassword
        })
      });
      const result = await response.json();
      alert(result.message);
      handleClose();
      if(response.ok){
        dispatch(setEmail(newEmail));
        dispatch(setRole('user'));
        dispatch(setUserName(newEmail.split('@')[0]));
        router.push('/home');
      } 
    }
    
  }

  const handleLogin = async()=>{
    if(password.length ==0 || username.length ==0){
      alert('Please Enter Required Fields!!');
      return false;
    } 
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
         username,
         password
      })
    });
    const result = await response.json();
    if(response.ok){
      dispatch(setEmail(username));
      dispatch(setRole(result.role));
      dispatch(setUserName(username.split('@')[0]));
      if(result.role == 'admin'){
        router.push('/admin');
      }
      else{
        router.push('/home');
      }
      
    }
    else{
      alert(result.message)
    }

    
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <TextField label="Email" variant="outlined" fullWidth value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>Login</Button>
      </form>
      <div className="new-user-container">
        <span className="new-user-text" onClick={handleClickOpen}>
          New User? Sign up here
        </span>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Registration</DialogTitle>
        <DialogContent sx={{ width: '500px', maxWidth: '90%' }}>
          <form className="registration-form">
            <TextField label="Username" variant="outlined" fullWidth margin="normal" value={newUserName} onChange={(e)=>setNewUsername(e.target.value)} required/>
            <TextField label="Email" type="email" variant="outlined" fullWidth margin="normal" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} required/>
            <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required/>
            <TextField label="Confirm Password" type="password" variant="outlined" fullWidth margin="normal" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSignUp} color="primary">Sign Up</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
