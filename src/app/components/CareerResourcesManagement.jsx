"use client";
import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import "./CareerResourcesManagement.css";

const CareerResourcesManagement = () => {
  const [resource, setResource] = useState({
    title: "",
    description: "",
    link: "",
    type: -1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResource({ ...resource, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/careerresources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resource,
      }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="career_resources_container">
      <h2>Career Resources Management</h2>
      <form onSubmit={handleSubmit} className="career_resources_form">
        <div className="form_group">
          <label>
            Title <span>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={resource.title}
            onChange={handleInputChange}
            placeholder="Resource Title"
            required
          />
        </div>

        <div className="form_group">
          <label>
            Description <span>*</span>
          </label>
          <textarea
            name="description"
            value={resource.description}
            onChange={handleInputChange}
            placeholder="Brief description"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="form_group">
          <label>
            Link <span>*</span>
          </label>
          <input
            name="link"
            onChange={handleInputChange}
            placeholder="Link"
            required
          ></input>
        </div>
        <div className="form_group">
          <label>
            Resource Type <span>*</span>
          </label>
          <TextField
            name="type"
            select
            fullWidth
            value={resource.type}
            onChange={handleInputChange}
            required
          >
            <MenuItem value={1}>Articles & Guides</MenuItem>
            <MenuItem value={2}>Workshops & Webinars</MenuItem>
            <MenuItem value={3}>Job Opportunities</MenuItem>
            <MenuItem value={4}>Announcements</MenuItem>
          </TextField>
        </div>

        <button type="submit" className="submit_btn">
          Add Resource
        </button>
      </form>
    </div>
  );
};

export default CareerResourcesManagement;
