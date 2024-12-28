"use client";
import React, { useState } from "react";
import "./ConferencesManagement.css";

const ConferenceManagement = ({ conferences }) => {
  const [name, setName] = useState("");
  const [conf_description, setConf_Description] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [max_tickets, setMax_Tickets] = useState(0);
  const [ticketTypes, setTicketTypes] = useState([{ type: "", price: "" }]);
  const [selectedConference, setSelectedConference] = useState(null);

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { type: "", price: "" }]);
  };

  const handleTicketTypeChange = (index, field, value) => {
    const updatedTickets = ticketTypes.map((ticket, i) =>
      i === index ? { ...ticket, [field]: value } : ticket
    );
    setTicketTypes(updatedTickets);
  };

  const handleDeleteTicketType = (index) => {
    const updatedTickets = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updatedTickets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/conferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        conf_description,
        startDate,
        endDate,
        location,
        max_tickets,
        ticketTypes
      }),
    });

    const data = await response.json();

    alert(data.message);

    setName("");
    setConf_Description("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setMax_Tickets(0);
    setTicketTypes([{ type: "", price: "" }]);
  };

  return (
    <div className="conference_management">
      <h2>Manage Conference</h2>

      <form onSubmit={handleSubmit} className="conference_form">
        <div className="form_group">
          <label>Conference Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Description:</label>
          <textarea
            value={conf_description}
            onChange={(e) => setConf_Description(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form_group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form_group">
          <label>Total Number of Tickets:</label>
          <input
            type="number"
            value={max_tickets}
            onChange={(e) => setMax_Tickets(e.target.value)}
            required
          />
        </div>

        <div className="ticket_section">
          <h3>Manage Ticket Types</h3>
          {ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket_type_row">
              <div className="form_group">
                <label>Ticket Type:</label>
                <input
                  type="text"
                  value={ticket.type}
                  onChange={(e) =>
                    handleTicketTypeChange(index, "type", e.target.value)
                  }
                  required
                />
              </div>
              <div className="form_group">
                <label>Price:</label>
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    handleTicketTypeChange(index, "price", e.target.value)
                  }
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteTicketType(index)}
              >
                Delete Ticket Type
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddTicketType}>
            Add Ticket Type
          </button>
        </div>

        <button type="submit">Save Conference</button>
      </form>
    </div>
  );
};

export default ConferenceManagement;
