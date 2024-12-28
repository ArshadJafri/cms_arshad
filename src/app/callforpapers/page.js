"use client";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../components/Header";
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  CardContent,
  Typography,
  Box,  
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import SearchIcon from "@mui/icons-material/Search";
import "./page.css";
import Footer from "../components/Footer";


const CallForPaperPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConference, setSelectedConference] = useState(null);
  const [callForPapers, setCallForPapers] = useState({});
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const router = useRouter();
  const [expanded, setExpanded] = useState(null);
  const [submissionRules, setSubmissionRules] = useState([]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const toggleFAQ = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const fetchCallForPaperDetails = async (conference_id, conference_name) => {
    try {
      const response = await fetch(
        `/api/callforpapers?conference_id=${conference_id}`
      );
      const data = await response.json();
      data.name = conference_name;
      if (data.callforpaper.submission_guidelines) {
        let submissionGuideLines =
          data.callforpaper.submission_guidelines.split(".");
        setSubmissionRules(prevRules => [...prevRules, ...submissionGuideLines]);
      }
      setSelectedConference(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences", {
          method: "GET",
        });
        const conferencesData = await response.json();
        setConferences(conferencesData);
        const callForPapersData = {};
        for (const conference of conferencesData) {
          const callForPapersResponse = await fetch(`/api/callforpapers?conference_id=${conference.id}`);
          const callForPapersInfo = await callForPapersResponse.json();
          callForPapersData[conference.id] = callForPapersInfo;
        }
        console.log("call for papers", callForPapersData);
        setCallForPapers(callForPapersData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };
    fetchConferences();
    setLoading(false);
  }, []);

  const filteredConferences = conferences.filter((conference) =>
    conference.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (filteredConferences.length > 0) {
      setLoading(true);
      // fetchCallForPaperDetails(
      //   filteredConferences[0].id,
      //   filteredConferences[0].name
      // );
      setLoading(false);
    } else {
      setSelectedConference(null);
    }
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
    <div className="call_for_papers_container">
      <Header />
      <div className="form_container">
        <Button
          style={{ margin: "20px" }}
          variant="contained"
          color="primary"
          onClick={() => router.push('/submissions')}
          sx={{ ml: 2 }}
        >
          Submit a Paper
        </Button>
        {conferences.length > 0 ? (
          conferences.map((conference, index) => (
            <Accordion key={index} expanded={expanded === index} onChange={() => toggleFAQ(index)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography className="conference-name">{conference.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card className="card_section">
                  <CardContent>
                    <Typography variant="h6" className="card_title">
                      Submission Instructions and Guidelines:
                    </Typography>
                    <ul className="bullet_list">
                      {callForPapers[conference.id]?.callforpaper?.submission_guidelines ? (
                        <ul>
                          {callForPapers[conference.id].callforpaper.submission_guidelines.split(',').map((guideline, index) => (
                            <li key={index}>{guideline.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        'N/A'
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="card_section">
                  <CardContent>
                    <Typography variant="h6" className="card_title">
                      Important Dates:
                    </Typography>
                    <ul className="bullet_list">
                      {callForPapers[conference.id]?.importantDates?.map(date => (
                        <li key={date.id}>
                          {date.event_name}: {new Date(date.event_date).toLocaleDateString()}
                        </li>
                      )) || <li>No important dates available.</li>}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="card_section">
                  <CardContent>
                    <Typography variant="h6" className="card_title">
                      FAQs:
                    </Typography>
                    {callForPapers[conference.id]?.faqs?.length > 0 && (
                      <>
                        {callForPapers[conference.id].faqs.map(faq => (
                          <div key={faq.id}>
                            <Typography variant="body1"><strong>Q:</strong> {faq.question}</Typography>
                            <Typography variant="body2"><strong>A:</strong> {faq.answer}</Typography>
                          </div>
                        ))}
                      </>
                    )}

                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p>No conference found. Please try a different search term.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CallForPaperPage;
