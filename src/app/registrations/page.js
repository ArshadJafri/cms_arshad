'use client';
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PaymentWrapper from "../components/PaymentWrapper";
import "./page.css";
import Header from "../components/Header";

const RegistrationPage = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [ticketAmount, setTicketAmount] = useState(10);
  const [conferences, setConferences] = useState([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState("");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [ticketTypeId, setTicketTypeId] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTicketTypeChange = (event) => setTicketTypeId(event.target.value);

  useEffect(() => {
    const selectedTicketType = ticketTypes.filter(ticketType => ticketType.id == ticketTypeId);
    if (selectedTicketType.length > 0) {
      setTicketAmount(selectedTicketType[0].price);
    } else {
      setTicketAmount(10);
    }
  }, [ticketTypeId]);
  
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences", {
          method: "GET",
        });
        const data = await response.json();
        setConferences(data);
      } catch (error) {
        console.error("Error fetching Conferences:", error.message);
        setLoading(false);
      }
    };
    fetchConferences();
    setLoading(false);
  }, []);

  const handleProcessPayment = ()=>{
    if(name == '' || email == '' || selectedConferenceId == '' || ticketTypeId == ''){
      alert('Please Enter All fields');
      return;
    }
    if(email && !email.includes('@') && !email.includes('.')){
      alert('Please Enter a valid email address');
      return;
    }
    handleOpen();
  }

  const handleConferenceChange = async(event) => {
    let conference_id = event.target.value;
    setSelectedConferenceId(conference_id);
    try {
      const response = await fetch(`/api/registrations?conference_id=${conference_id}`, {
        method: "GET",
      });
      const data = await response.json();
      setTicketTypes(data.ticketTypes);
    } catch (error) {
      console.error("Error fetching TicketTypes:", error.message);
      alert(error.message)
    }
  }
  const handlePaymentComplete = (paymentSuccess = false) =>{
    if(paymentSuccess){
      console.log('Payment successful');
      handleClose();
      setLoading(true);
      handleSubmit();
    }
  }
  const handleSubmit = async() => {
    let ticket_type = 'Student';
    let ticket_price = 10;

    console.log('selected ticket type', ticketAmount);
    
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conference_id: selectedConferenceId,
          email,
          ticket_type,
          ticket_price,
          institution
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message);
    }
    setLoading(false); 
    setTicketTypeId('');
    setName('');
    setEmail('');
    setSelectedConferenceId('');
    setInstitution('');
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
    <div className="registration_page">
      <Header />
      <div className="registration_container">
        <h1 className="registration_title">Registration & Ticketing</h1>
        <Grid container spacing={3} className="registration_form">
          <Grid item xs={12}>
            <TextField
              select
              label=" Select Conference"
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
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Name" variant="outlined"  onChange={(e)=>setName(e.target.value)} required/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)} required/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Institution" variant="outlined" onChange={(e)=>setInstitution(e.target.value)}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Select Ticket Type"
              fullWidth
              value={ticketTypeId}
              onChange={handleTicketTypeChange}
              required
            >
              {ticketTypes.map((tt) => (
                <MenuItem key={tt.id} value={tt.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}>
                  <span>{tt.ticket_type}</span>
                  <span>$({tt.price})</span>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleProcessPayment}>
              Continue Payment
            </Button>
          </Grid>
        </Grid>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Your Payment</DialogTitle>
        <DialogContent>
          <PaymentWrapper ticketAmount={ticketAmount} handlePaymentComplete = {handlePaymentComplete}/>
        </DialogContent>
      </Dialog>
      </div>
      {/* <Footer /> */}
    </div>
  );
};
export default RegistrationPage;
