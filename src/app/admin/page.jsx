"use client";
import React, { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress'; 
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ConferenceManagement from "../components/ConferencesManagement";
import CallForPapersManagement from "../components/CallForPapersManagement";
import SessionsManagement from "../components/SessionsManagement";
import MentorsManagement from "../components/MentorsManagement";
import CareerResourcesManagement from "../components/CareerResourcesManagement";
import UsersManagement from "../components/UsersManagement";
import VirtualConferenceManagement from "../components/VirtualConferenceManagement";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearEmail, clearRole, clearUserName  } from "@/redux/userSlice";

//import VirtualConferenceManagement from "../components/VirtualConferenceManagement";

const drawerWidth = 240;

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState("conferences");
  const [loading, setLoading] = useState(true);
  const [conferences, setConferences] = useState([]);
  const role = useSelector((state) => state.user.role);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences",{
          method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        setConferences(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchConferences();
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

  if(role == null){
    router.push('/');
  }

  const handleSignOut = () => {
    router.push('/');
    dispatch(clearEmail());
    dispatch(clearRole());
    dispatch(clearUserName());
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "conferences":
        return <ConferenceManagement conferences={conferences} />;
      case "callForPapers":
        return <CallForPapersManagement conferences={conferences} />;
      case "sessions":
        return <SessionsManagement conferences={conferences} />;
      case "mentors":
        return <MentorsManagement />;
      case "users":
        return <UsersManagement />;
      case "resources":
        return <CareerResourcesManagement />;
      case "virtual-conference":
        return <VirtualConferenceManagement conferences={conferences}/>;

      default:
        return <ConferenceManagement conferences={conferences}/>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem button onClick={() => setSelectedSection("conferences")}>
              <ListItemText primary="Conferences" />
            </ListItem>
            <ListItem
              button
              onClick={() => setSelectedSection("callForPapers")}
            >
              <ListItemText primary="Call for Papers" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection("sessions")}>
              <ListItemText primary="Sessions" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection("mentors")}>
              <ListItemText primary="Mentors" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection("resources")}>
              <ListItemText primary="CareerResources" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection("virtual-conference")}>
              <ListItemText primary="VirtualConference" />
            </ListItem>
            <ListItem button onClick={() => setSelectedSection("users")}>
              <ListItemText primary="Users" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Admin Panel - Conference Management System
            </Typography>

            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>

        <Toolbar />

        {renderSection()}
      </Box>
    </Box>
  );
};

export default AdminPage;
