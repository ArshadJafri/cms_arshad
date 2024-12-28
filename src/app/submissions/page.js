"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./page.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
const SubmissionsPage = () => {
  const [paperTitle, setPaperTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [email, setEmail] = useState("");
  const [paperFile, setPaperFile] = useState(null);
  const selectedConferenceIndex = 0;
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences", {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setConferences(data);
        setSelectedConferenceId(data[selectedConferenceIndex].id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchConferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paperFile || paperFile.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    const arrayBuffer = await paperFile.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    const formData = new FormData();
    formData.append("conference_id", selectedConferenceId);
    formData.append("paper_title", paperTitle);
    formData.append("author_name", authorName);
    formData.append("email", email);
    formData.append("file", paperFile);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: JSON.stringify({
          file: Array.from(fileBytes),
          conference_id:selectedConferenceId,
          paper_title: paperTitle,
          author_name: authorName,
          email: email,
          filename: paperFile.name
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Swal.fire("Success", "Paper submitted successfully!", "success");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("An error occurred while submitting the paper");
      console.error("Error:", err);
    }
    setAuthorName('');
    setEmail('');
    setPaperTitle('');
    setPaperFile(null);
    setSelectedConferenceId(conferences[selectedConferenceIndex].id);
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
    <>
      <Header />
      <div className="submission_container">
        <div className="submission_title_container">
          <Typography variant="h4" className="submission_title">
            Submit Your Paper
          </Typography>
          <CloudUploadIcon className="submit_icon" />
        </div>
        <form onSubmit={handleSubmit}  encType="multipart/form-data" className="submission_form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Conference Topic"
                fullWidth
                value={selectedConferenceId}
                onChange={(e) => setSelectedConferenceId(e.target.value)}
                required
              >
                {conferences.map((conference) => (
                  <MenuItem key={conference.id} value={conference.id}>
                    {conference.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paper Title"
                fullWidth
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Author Name"
                fullWidth
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <p>Upload Paper (Only pdf files are accepted)</p>
              <TextField
                type="file"
                fullWidth
                accept
                onChange={(e) => setPaperFile(e.target.files[0])}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit Paper
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default SubmissionsPage;
