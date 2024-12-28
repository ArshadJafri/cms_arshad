"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Box, MenuItem, TextField } from "@mui/material";
import "./UsersManagement.css";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/login", {
          method: "GET",
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchUsers();
    setLoading(false);
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setRole(user.role);
  };

  const handleRoleUpdate = async () => {
    if (selectedUser) {
      console.log(`Updating role of ${selectedUser.email} to ${newRole}`);
      try {
        const response = await fetch(
          `/api/users/roleUpdate?email=${encodeURIComponent(selectedUser.email)}&role=${newRole}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        alert(result.message);
        if(response.ok){
          setSelectedUser(null);
          setRole("");
          setNewRole("");
          setSearchTerm("");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
      
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setNewRole(e.target.value)
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="user_management">
      <h2>User Management for Managing Roles</h2>

      <div className="search_user">
        <label>Search User by Email:</label>
        <input
          type="text"
          placeholder="Enter email to search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="user_list">
          {filteredUsers.map((user) => (
            <li key={user.id} onClick={() => handleUserSelect(user)}>
              {user.email}
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className="role_update">
          <h3>Update Role for {selectedUser.email}  </h3>
          <h3>Current Role: {role}</h3>
          <label>
            Select New Role <span>*</span>
          </label>
          <TextField
            name="type"
            select
            fullWidth
            value={newRole}
            onChange={handleInputChange}
            required
          >
            <MenuItem value={'admin'}>Admin</MenuItem>
            <MenuItem value={'reviewer'}>Reviewer</MenuItem>
            <MenuItem value={'user'}>User</MenuItem>
          </TextField>
          <button onClick={handleRoleUpdate}>Update Role</button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
