"use client";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./SessionsManagement.css";
import { Typography, Box } from "@mui/material";

const SessionsManagement = ({ conferences }) => {
  const [selectedConferenceId, setSelectedConferenceId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [agenda, setAgenda] = useState("");
  const [presentationTopics, setPresentationTopics] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [liveStreamingLink, setLiveStreamingLink] = useState("");
  const [recordingLink, setRecordingLink] = useState("");
  const [sessionsData, setSessionsData] = useState([]);
  const [updateSession, setUpdateSession] = useState(false);
  const [updatedSessionId, setUpdatedSessionId] = useState(null);

  const fetchSessions = async (conferenceId) => {
    try {
      const response = await fetch(
        `/api/sessions?conference_id=${conferenceId}`
      );
      const data = await response.json();
      console.log(data);
      setSessionsData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      
    }
    setLoading(false);
  };
  useEffect(() => {
    if (conferences.length > 0) {
      setSelectedConferenceId(conferences[0].id);
      fetchSessions(conferences[0].id);
    } else {
    }
  }, []);
  
  const handleConferenceChange = (event) => {
    let conference_id = event.target.value;
    setSelectedConferenceId(conference_id);
    setLoading(true);
    fetchSessions(conference_id);
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return "";

    const date = new Date(datetime);

    // Format to 'YYYY-MM-DDTHH:MM'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (updateSession) {
      const updatedSessionData = {
        agenda,
        presentation_topics: presentationTopics,
        speaker,
        start_time: startTime,
        end_time: endTime,
        live_streaming_link: liveStreamingLink,
        recording_link: recordingLink,
      };
      try {
        const response = await fetch(
          `/api/sessions?session_id=${updatedSessionId}&conference_id=${selectedConferenceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSessionData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Update Successful:", data.message);
          alert(data.message);
          setSessionsData((prevSessions) =>
            prevSessions.map((session) =>
                session.id === updatedSessionId ? { ...session, ...updatedSessionData } : session
            )
        );
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    } else {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conference_id: selectedConferenceId,
            agenda,
            presentation_topics: presentationTopics,
            speaker,
            start_time: startTime,
            end_time: endTime,
            live_streaming_link: liveStreamingLink,
            recording_link: recordingLink,
          }),
        });
        const result = await response.json();
        console.log(result);
        alert(result.message);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      const newSession = {
        id: Date.now(), // Unique ID for each new session
        agenda,
        presentationTopics,
        speaker,
        startTime,
        endTime,
        liveStreamingLink,
        recordingLink,
      };

      setSessionsData([...sessionsData, newSession]);
    }

    // Clear form fields after submission
    setAgenda("");
    setPresentationTopics("");
    setSpeaker("");
    setStartTime("");
    setEndTime("");
    setLiveStreamingLink("");
    setRecordingLink("");
    setUpdateSession(false);
    setUpdatedSessionId(null);
    setSessionsData([])
  };

  const handleDeleteSession = async (sessionId) => {  
    setSessionsData((prevData) => prevData.filter((session) => session.id !== sessionId));
  };

  const handleEditSession = async (session) => {
    setAgenda(session.agenda);
    setPresentationTopics(session.presentation_topics);
    setSpeaker(session.speaker);
    setStartTime(formatDateTime(session.start_time));
    setEndTime(formatDateTime(session.end_time));
    setLiveStreamingLink(session.live_streaming_link);
    setRecordingLink(session.recording_link);
    setUpdateSession(true);
    setUpdatedSessionId(session.id);
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
    <div className="session_management">
      <h2>Session Management</h2>
      <form onSubmit={handleSubmit}>
        {/* Select Conference */}
        <div className="form_group">
          <label>Select Conference:</label>
          <select
            value={selectedConferenceId}
            onChange={handleConferenceChange}
            required
          >
            <option value="">-- Select Conference --</option>
            {conferences.map((conference) => (
              <option key={conference.id} value={conference.id}>
                {conference.name}
              </option>
            ))}
          </select>
        </div>

        {/* Agenda */}
        <div className="form_group">
          <label>Agenda:</label>
          <input
            type="text"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            required
          />
        </div>

        {/* Presentation Topics (Text Area) */}
        <div className="form_group">
          <label>Presentation Topics:</label>
          <textarea
            value={presentationTopics}
            onChange={(e) => setPresentationTopics(e.target.value)}
            required
          />
        </div>

        {/* Speaker */}
        <div className="form_group">
          <label>Speaker:</label>
          <input
            type="text"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            required
          />
        </div>

        {/* Start Time */}
        <div className="form_group">
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* End Time */}
        <div className="form_group">
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* Live Streaming Link (Optional) */}
        <div className="form_group">
          <label>Live Streaming Link (Optional):</label>
          <input
            type="url"
            value={liveStreamingLink}
            onChange={(e) => setLiveStreamingLink(e.target.value)}
          />
        </div>

        {/* Recording Link (Optional) */}
        <div className="form_group">
          <label>Recording Link (Optional):</label>
          <input
            type="url"
            value={recordingLink}
            onChange={(e) => setRecordingLink(e.target.value)}
          />
        </div>

        {updateSession? <button type="submit">Update Session</button>: <button type="submit">Add Session</button>}
      </form>

      {/* Display Existing Sessions for the Selected Conference */}
      {selectedConferenceId && (
        <div className="existing_sessions">
          <h3>
            Existing Sessions for{" "}
            {conferences.find((conf) => conf.id == selectedConferenceId)?.name}:
          </h3>
          <table>
            <thead>
              <tr>
                <th>Agenda</th>
                <th>Topics</th>
                <th>Speaker</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Live Streaming Link</th>
                <th>Recording Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessionsData?.map((session) => (
                <tr key={session.id}>
                  <td>{session.agenda}</td>
                  <td>{session.presentation_topics}</td>
                  <td>{session.speaker}</td>
                  <td>{formatDateTime(session.start_time)}</td>
                  <td>{formatDateTime(session.end_time)}</td>
                  <td>
                    {session.liveStreamingLink ? (
                      <a href={session.liveStreamingLink} target="_blank" rel="noopener noreferrer">
                        {session.liveStreamingLink}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {session.recording_link ? (
                      <a href={session.recording_link} target="_blank" rel="noopener noreferrer">
                        {session.recording_link}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditSession(session)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteSession(session.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionsManagement;
