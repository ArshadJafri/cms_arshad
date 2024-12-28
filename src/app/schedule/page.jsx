"use client";
import React, { useState, useEffect } from "react";
import {
  Collapse,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Calendar } from "react-calendar";
import CircularProgress from "@mui/material/CircularProgress";

import "./page.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(true);
  const [expandedConference, setExpandedConference] = useState(null);
  const [conferences, setConferences] = useState([]);

  const fetchConferences = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/schedule?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setConferences(data);
        console.log(data);
      } else {
        console.error("Error fetching conferences:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDate) fetchConferences(selectedDate);
  }, [selectedDate]);

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    const selectedDateFormatted = formatDateLocal(date);
    setSelectedDate(selectedDateFormatted);
    fetchConferences(selectedDateFormatted);
  };

  const handleExpandClick = (conferenceId) => {
    setExpandedConference(
      expandedConference === conferenceId ? null : conferenceId
    );
  };
  const isSelectedDate = (date) => {
    return formatDateLocal(date) == selectedDate;
  };

  const exportAsJSON = () => {
    // Convert array of objects to JSON string
    const jsonContent = JSON.stringify(conferences, null, 2);

    // Create a Blob from the JSON content
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    // Clean up the URL
    URL.revokeObjectURL(url);
};

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // Full page height
        flexDirection="column"
      >
        <CircularProgress size={60} thickness={5} /> {/* Spinner */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="schedule_page">
      <Header />
      <div>
        <h1>Upcoming conferences Schedule & Agenda</h1>
        <div className="hero_section">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="calendar_view"
            tileClassName={({ date }) =>
              isSelectedDate(date) ? "selected_date" : ""
            }
            showNeighboringMonth={false}
          />
          <Button variant="contained" color="primary" className="export_btn"  onClick={exportAsJSON}>
            Export Conferences
          </Button>
        </div>

        <div className="conference_list_container">
          <div className="conference_list">
            {conferences.map((conference) => (
              <Card key={conference.id} className="conference_card">
                <CardContent>
                  <div className="conference_header">
                    <div className="conference_info">
                      <Typography variant="h6">{conference.name}</Typography>
                      <Typography variant="subtitle1">
                        At {conference.location}
                      </Typography>
                    </div>

                    <Button
                      onClick={() => handleExpandClick(conference.id)}
                      className="expand_btn"
                    >
                      {expandedConference === conference.id
                        ? "Collapse"
                        : "Expand"}
                    </Button>
                  </div>
                </CardContent>

                <Collapse in={expandedConference === conference.id}>
                  {conference.sessions.map((session, index) => (
                    <CardContent key={index} className="session_details">
                      <Typography variant="body1">
                        Agenda: {session.agenda}
                      </Typography>
                      <Typography variant="body2">
                        Topics: {session.presentation_topics}
                      </Typography>
                      <Typography variant="body2">
                        Speaker: {session.speaker}
                      </Typography>
                      <Typography variant="body2">
                        Time: {session.start_time} - {session.end_time}
                      </Typography>
                    </CardContent>
                  ))}
                </Collapse>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};
export default SchedulePage;
