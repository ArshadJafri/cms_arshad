"use client";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import CircularProgress from "@mui/material/CircularProgress";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./page.css";
import Header from "../components/Header";
import Calendar from "react-calendar";

const MentorshipPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectEmail, setSelectEmail] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState(0);
  const [availableSlots, setAvailableSlots] = useState();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const fetchAllMentors = async () => {
    try {
      const response = await fetch("/api/mentors", {
        method: "GET",
      });
      const data = await response.json();
      const updatedMentors = data?.map((mentor) => {
        if (mentor.profile_picture && mentor.profile_picture.data) {
          const base64String = Buffer.from(
            mentor.profile_picture.data
          ).toString("base64");
          mentor.profileImageUrl = `data:image/png;base64,${base64String}`;
        }
        return mentor;
      });
      setMentors(updatedMentors);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchAllMentors();
  }, []);

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const checkAvailableSlotsForDate = (slots, date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = daysOfWeek[date.getDay()];

    const isDayInSlots = slots.some((slot) => slot.day === dayName);
    console.log(isDayInSlots || dayName);
    if (isDayInSlots || dayName) {
      const slotsOnDay = slots.filter((slot) => {
        if (slot.day == dayName) return slot;
      });
      setAvailableSlots(slotsOnDay);
    }
  };

  const handleScheduleSession = (mentor_id, mentor_email) => {
    setSelectedMentorId(mentor_id);
    setSelectEmail(mentor_email);
    setOpen(true);
    const selectedMentor = mentors.find(
      (mentor) => mentor.mentor_id == mentor_id
    );
    checkAvailableSlotsForDate(selectedMentor.slots, new Date(selectedDate));
  };

  const handleClickOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const handleSchRegister = async (mentor_id, mentor_email) =>  {
    console.log("Registration Data:", selectEmail);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conference_id: -1,
          email: selectEmail,
          ticket_type: "Student",
          ticket_price: 10,
          institution: "UTA"
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.error("Error submitting", error);
      alert(error.message);
    }
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setAvailableSlots([]);
  };

  const handleDateChange = (date) => {
    setAvailableSlots([]);
    setSelectedDate(formatDateLocal(date));
    const selectedMentor = mentors.find(
      (mentor) => mentor.mentor_id == selectedMentorId
    );
    checkAvailableSlotsForDate(selectedMentor.slots, new Date(date));
  };

  const handleConfirmSlot = (time) => {
    alert(`Slot booked for ${time} on ${selectedDate}`);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    handleCloseRegister();
  };
  const isSelectedDate = (date) => {
    return formatDateLocal(date) == selectedDate;
  };
  const handleSearch = () => {
    setLoading(true);
    if (searchTerm == '') {
      fetchAllMentors();
    }
    else fetchAllMentors(searchTerm);
    setSearchTerm('');
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
    <div>
      <Header />
      <div className="mentorship_container">
        <h1>Find Mentor & Schedule a Session</h1>
        {/* <div className="search_bar_container">
          <TextField
            variant="outlined"
            placeholder="Search by mentor name or field of expertise"
            className="search_bar"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            color="primary"
            className="search_button"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div> */}
        <div className="register_button_container">
        </div>
        <div className="mentor_container">
          {mentors.length > 0 ? <Grid container spacing={3} className="mentors_list">
            {mentors.map((mentor) => (
              <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                <Card className="mentor_card">
                  {mentor.profileImageUrl ? (
                    <img
                      src={mentor.profileImageUrl}
                      alt={`${mentor.name}'s Profile`}
                      className="mentor_image"
                    />
                  ) : (
                    <p>No profile picture available</p>
                  )}

                  <CardContent>
                    <Typography variant="h5">{mentor.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {mentor.title}
                    </Typography>
                    <Typography variant="body1">
                      {mentor.description}
                    </Typography>
                    <Typography variant="body2">
                      Expertise: {mentor.expertise}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      className="schedule_button"
                      onClick={() => handleScheduleSession(mentor.mentor_id, mentor.email)}
                    >
                      Schedule Session
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid> :
            <p>No Results found for the search</p>
          }

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Select Date for Session</DialogTitle>
            <DialogContent>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileClassName={({ date }) =>
                  isSelectedDate(date) ? "selected_date" : ""
                }
              />
              {/* {availableSlots.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6">Available Slots:</Typography>
                  {availableSlots.map((slot, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      marginTop={1}
                    >
                      <Typography>{slot.time}</Typography>

                      <Button
                        variant="outlined"
                        onClick={() => handleConfirmSlot(slot.time)}
                      >
                        Select
                      </Button>
                    </Box>
                  ))}
                </Box>
              )} */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSchRegister} color="primary">
                Register
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openRegister} onClose={handleCloseRegister}>
            <DialogTitle>Register for Mentorship</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Phone"
                type="tel"
                fullWidth
                variant="outlined"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRegister} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleRegister} color="primary">
                Register
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default MentorshipPage;
