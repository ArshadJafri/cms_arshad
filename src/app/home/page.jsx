"use client";
import CircularProgress from '@mui/material/CircularProgress'; 
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography';
import Header from '../components/Header';
import HomePageImageSlider from '../components/HomePageImageSlider';
import "./page.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const [resources, setResources] = useState([]);
  const userName = useSelector((state) => state.user.userName);
 
  useEffect(() => {
    console.log(`Logged in as: ${userName}`);
    const fetchAnnouncements = async () => {
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
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences",{
          method: 'GET',
        });
        const data = await response.json();
        data.forEach((conference) => {
          conference["imageUrl"] = "/images/Conference1.jpg";
        });
        console.log(data);
        setConferences(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchConferences();
    fetchAnnouncements();
  }, []);
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
    <div className='homepage'>
      <Header />

      <HomePageImageSlider conferences={conferences} />

      <div className='sections_container'>
        <div className='quick_links'>
          <h2>Quick Links</h2>

          <ul>
            <li>
              <Link href="/callforpapers">Call for Papers</Link>
            </li>
            <li>
              <Link href="/registrations">Registration</Link>
            </li>
            <li>
              <Link href="/schedule">View Schedule</Link>
            </li>
          </ul>
        </div>
        <div className='announcements'>
          <h2>Announcements</h2>

          <ul>
          {resources.map((announcement, index) => (
                    announcement.type == 4 && <li key={index}>
                      <a href={announcement.link}>{announcement.title}</a>
                    </li>
                  ))}
          </ul>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
