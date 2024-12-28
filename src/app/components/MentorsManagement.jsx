"use client";
import React, { useState } from "react";
import "./MentorsManagement.css";

const MentorsManagement = () => {
  //const [mentors, setMentors] = useState(initialMentorData);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expertise, setExpertise] = useState("");
  const [slots, setSlots] = useState([{ day_of_week: "Sunday", time: "1pm" }]);
  const [cost, setCost] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [profilePic, setProfilePic] = useState('');

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { day_of_week: "", time: "" }]);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Strip the prefix
        // Send base64String to your API for storage after converting to binary
        setProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    }
};

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newMentorData = {
      name: name,
      email: email,
      title: title,
      description: description,
      expertise: expertise,
      cost_per_session: cost,
      meeting_link: meetingLink,
      profile_picture: profilePic,
      slots: slots
  };
  console.log("slots", slots)
  try {
    const response = await fetch('/api/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMentorData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Mentor created successfully');
      alert(result.message);
    } else {
        console.error('Failed to create mentor');
    }
} catch (error) {
    console.error('Error:', error);
}

    // const newMentor = {
    //   id: Date.now(),
    //   name,
    //   email,
    //   title,
    //   description,
    //   expertise,
    //   slots,
    //   cost,
    //   meetingLink,
    //   profilePic: profilePic
    //     ? URL.createObjectURL(profilePic)
    //     : "default-pic.jpg",
    // };

    // setMentors([...mentors, newMentor]);

    setName("");
    setEmail("");
    setTitle("");
    setDescription("");
    setExpertise("");
    setSlots([{ day: "", time: "" }]);
    setCost("");
    setMeetingLink("");
    setProfilePic('');
  };

  // const handleEditMentor = (mentor) => {
  //   setName(mentor.name);
  //   setEmail(mentor.email);
  //   setTitle(mentor.title);
  //   setDescription(mentor.description);
  //   setExpertise(mentor.expertise);
  //   setSlots(mentor.slots);
  //   setCost(mentor.cost);
  //   setMeetingLink(mentor.meetingLink);
  //   setProfilePic(null);
  // };

  // const handleDeleteMentor = (id) => {
  //   setMentors(mentors.filter((mentor) => mentor.id !== id));
  // };

  return (
    <div className="mentor_management">
      <h2>Mentor Management</h2>
      <form onSubmit={handleSubmit}>
        <div className="form_group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Short Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Areas of Expertise:</label>
          <input
            type="text"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            required
          />
        </div>

        {/* <div className="form_group">
          <label>Available Slots:</label>
          {slots.map((slot, index) => (
            <div key={index} className="slot_group">
              <input
                type="text"
                placeholder="Day (e.g., Monday)"
                value={slot.day}
                onChange={(e) => handleSlotChange(index, "day_of_week", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Time (e.g., 2 PM - 4 PM)"
                value={slot.time}
                onChange={(e) =>
                  handleSlotChange(index, "time", e.target.value)
                }
                required
              />
            </div>
          ))}
          <button type="button" onClick={addSlot}>
            Add Slot
          </button>
        </div> */}

        <div className="form_group">
          <label>Cost per Session (USD):</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Meeting Link:</label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>

        <div className="form_group">
          <label>Profile Picture: (Max only 1mb size is allowed)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleProfilePictureChange(e)}
          />
        </div>

        <button type="submit">Save Mentor</button>
      </form>

      {/* {mentors.length > 0 && (
        <div className="mentor_list">
          <h3>Existing Mentors</h3>
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Title</th>
                <th>Description</th>
                <th>Expertise</th>
                <th>Slots</th>
                <th>Cost</th>
                <th>Meeting Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.map((mentor) => (
                <tr key={mentor.id}>
                  <td>
                    <img
                      src={mentor.profilePic}
                      alt="Profile Pic"
                      className="profile_pic"
                    />
                  </td>
                  <td>{mentor.name}</td>
                  <td>{mentor.email}</td>
                  <td>{mentor.title}</td>
                  <td>{mentor.description}</td>
                  <td>{mentor.expertise}</td>
                  <td>
                    {mentor.slots.map((slot, idx) => (
                      <div key={idx}>
                        {slot.day}: {slot.time}
                      </div>
                    ))}
                  </td>
                  <td>{mentor.cost} USD</td>
                  <td>
                    <a
                      href={mentor.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleEditMentor(mentor)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteMentor(mentor.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    </div>
  );
};

export default MentorsManagement;
