"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  Box,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select, MenuItem
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import "./page.css";
import Header from "../components/Header";
import Chat from "../components/Chat";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  popup: {
    width: "300px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  submitButton: {
    padding: "10px 20px",
    marginRight: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const VirtualConferencePage = () => {
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState("");
  const [sessionsData, setSessionsData] = useState([]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences", {
          method: "GET",
        });
        const data = await response.json();
        setConferences(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };
    fetchConferences();
    setLoading(false);
  }, []);

  const fetchSessions = async (conferenceId) => {
    try {
      const response = await fetch(
        `/api/sessions?conference_id=${conferenceId}`
      );
      const data = await response.json();
      setSessionsData(data);
    } catch (err) {
      console.error("Error fetching data:", err);

    }
    setLoading(false);
  };

  const handleConferenceChange = (event) => {
    let conference_id = event.target.value;
    setLoading(true);
    setSelectedConferenceId(conference_id);
    fetchSessions(conference_id);
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

  const handleStartMeeting = async () => {
    try {
      const response = await fetch(`/api/meetingflag?conference_id=${selectedConferenceId}`, {
        method: "GET"
      });
  
      const started = await response.json();
      // console.log("stared ", started.result[0].started);
      if(started?.result?.[0]?.started ?? false){
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setIsStreaming(true);
      } else{
        alert("conference not started yet");
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
      alert('Error accessing video: ' + err.message);
    }
  }

  const handleStopMeeting = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setIsStreaming(false);
  };

  return (
    <div className="virtual_conference_page">
      <Header />
      <Container maxWidth="lg" className="virtual_conference_container">
        <h1>Live Streaming & Recorded Sessions</h1>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box className="video-container">
              <div style={{ width: "100%", height: "400px", display: "flex", flexDirection: "column" }}>
              <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  height="300"
                  muted
                />
                {isStreaming ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleStopMeeting}
                    sx={{  top: "10px", right: "10px" }}
                  >
                    Exit Meeting
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartMeeting}
                    sx={{  top: "10px", right: "10px" }}
                  >
                    Join Meeting
                  </Button>
                )}
              </div>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Chat />
          </Grid>
        </Grid>

        <Card className="recorded_sessions_card" style={{ marginTop: "20px" }}>
          <h2>Select Session</h2>
          <Select
            value={selectedConferenceId}
            onChange={handleConferenceChange}
            displayEmpty
            fullWidth
            variant="outlined"
            style={{ marginBottom: "20px" }}
          >

            <MenuItem value="" disabled>
              Select a Conference
            </MenuItem>
            {conferences?.map((conference) => (
              <MenuItem key={conference.id} value={conference.id}>
                {conference.name}
              </MenuItem>
            ))}
          </Select>
          {sessionsData.length > 0 && sessionsData.map((session) => (
            <Accordion key={session.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{session.agenda}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  by {session.speaker}<br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.open(session.recording_link, '_blank')}
                >
                  Watch Recording
                </Button>
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          <Typography variant="body2" align="center" gutterBottom>
            Click on the session title to access the recording.
          </Typography>

        </Card>
      </Container>
    </div>
  );
};
export default VirtualConferencePage;
