"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  Box
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "./page.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from 'react-redux';
const PeerReviewPage = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conferenceTopic, setConferenceTopic] = useState("");
  const [selectedConferenceId, setSelectedConferenceId] = useState("");
  const [submittedPapers, setSubmittedPapers] = useState([]);
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [paperDetails, setPaperDetails] = useState({
    paper_title: "",
    author_name: "",
    email: "",
    created_at: "",
  });
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const email = useSelector((state) => state.user.email);
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences", {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setConferences(data);
        // setSelectedConferenceId(data[selectedConferenceIndex].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchConferences();
  }, []);

  const handleConferenceChange = async (event) => {
    let conferenceId = event.target.value;
    setSelectedConferenceId(conferenceId);
    setLoading(true);
    if (conferenceId) {
      try {
        const response = await fetch(
          `/api/submissions?conference_id=${conferenceId}`
        );
        const data = await response.json();
        setSubmittedPapers(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    } else {
      setSubmittedPapers([]);
    }
    setLoading(false);
  };

  const handlePaperChange = (event) => {
    const selectedId = event.target.value;
    const paper = submittedPapers.find((p) => p.id === selectedId);
    setSelectedPaperId(selectedId);
    setPaperDetails(paper);
  };

  async function downloadFileByEmail(email) {
    if (email) {
      try {
        const response = await fetch(
          `/api/submissions?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();
        alert(data.message);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert(err.message);
      }
    } else {
    }
  }

  // Usage in a component

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/peer-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: parseInt(score),
          feedback,
          paper_id: parseInt(selectedPaperId),
          email,
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review");
    }
    setConferenceTopic("");
    setSelectedConferenceId("");
    setScore("");
    setFeedback("");
    setSelectedPaperId("");
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
    <div className="peer_review_page">
      <Header />
      {role =='reviewer' ?<Container maxWidth="sm" className="peer_review_container">
        <h1>Peer Review Submission</h1>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              select
              label="Conference Topic"
              fullWidth
              value={selectedConferenceId}
              onChange={handleConferenceChange}
              required
            >
              {conferences.map((conference) => (
                <MenuItem key={conference.id} value={conference.id}>
                  {conference.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <FormControl fullWidth margin="normal" disabled={!conferenceTopic}>
            <TextField
              select
              label="Submitted Papers"
              fullWidth
              value={selectedPaperId}
              onChange={handlePaperChange}
              required
            >
              {submittedPapers.map((paper) => (
                <MenuItem
                  key={paper.id}
                  value={paper.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <span>{paper.paper_title}</span>
                  <span>by {paper.author_name}</span>
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          {selectedPaperId && (
            <Card className="paper_details_card">
              <Typography variant="h6">Paper Details</Typography>
              <Typography variant="body1">
                Title: {paperDetails.paper_title}
              </Typography>
              <Typography variant="body1">
                Author: {paperDetails.author_name}
              </Typography>
              <Typography variant="body1">
                Submitted On: {paperDetails.created_at}
              </Typography>
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => downloadFileByEmail(paperDetails.email)}
              >
                Download Paper
              </a>
            </Card>
          )}

          <FormControl fullWidth margin="normal">
            <TextField
              label="Score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Submit Review
          </Button>
        </form>
      </Container>:
      <p style={{textAlign:'center', marginTop: '45px', fontWeight:'bold'}}>
        Sorry! You can&apos;t review the papers as you don&apos;t have permissions. Please contact admin.
      </p>
      }
    
    </div>
  );
};
export default PeerReviewPage;
