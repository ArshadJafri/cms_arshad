'use client';
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, CardContent, Typography, Grid, Button, Box } from "@mui/material";
import "./page.css";
import Header from "../components/Header";
import Footer from "../components/Footer";


const CareerResourcePage = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  useEffect(()=>{
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/careerresources", {
          method: "GET",
        });
        const data = await response.json();
        setResources(data.result);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };
    fetchResources();
    setLoading(false);
  },[]);

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
    <div className="career_resource_page">
      <Header />
      <div className="career_resource_container">
        <h1>Career Development Resources</h1>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Card className="career_card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Articles and Guides on Career Advancement
                </Typography>
                <ul className="resource_list">
                  {resources.map((article, index) => (
                    article.type ==1 && <li key={index}>
                      <a href={article.link}>{article.title}</a>
                    </li>
                  ))}
                </ul>
                
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card className="career_card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Links to Workshops and Webinars
                </Typography>
                <ul className="resource_list">
                  {resources.map((workshop, index) => (
                    workshop.type ==2 &&<li key={index}>
                      <a href={workshop.link}>{workshop.title}</a>
                    </li>
                  ))}
                </ul>
                
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className="career_card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Job Board with Academic Opportunities
                </Typography>
                <ul className="resource_list">
                  {resources.map((job, index) => (
                   job.type ==3 && <li key={index}>
                      <a href={job.link}>{job.title}</a>
                    </li>
                  ))}
                </ul>
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      {/* <Footer /> */}
    </div>
  );
};
export default CareerResourcePage;
