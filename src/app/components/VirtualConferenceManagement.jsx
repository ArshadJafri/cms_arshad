"use client";
import React, { useState, useRef } from "react";
import { Button } from "@mui/material";
import "./ConferencesManagement.css";

const VirtualConferenceManagement = ({ conferences }) => {
  const [selectedConferenceId, setSelectedConferenceId] = useState(0);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);

  const handleStartMeeting = async () => {
    try {
      const response = await fetch(`/api/meetingflag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedConferenceId,
          started: 1,
        }),
      });

      const isStarted = await response.json();
      if(isStarted){
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing media devices.', err);
      alert('Error accessing video: ' + err.message);
    }
  }

  const handleStopMeeting = async () => {

    const response = await fetch(`/api/meetingflag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedConferenceId,
        started: 0,
      }),
    });

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

  const handleConferenceChange = (e) => {
    setSelectedConferenceId(e.target.value);
    console.log(e.target.value);
  };


  return (
    <div className="conference_management">
      <h2>Manage Virtual Conference</h2>

      <div className="conference_form">
        <div className="form_group">
          <label>Select Conference:</label>
          <select
            value={selectedConferenceId}
            onChange={handleConferenceChange}
            required
          >
            <option value="">-- Select Conference --</option>
            {conferences.map((conf, index) => (
              <option key={index} value={conf.id}>
                {conf.name}
              </option>
            ))}
          </select>
        </div>
        {selectedConferenceId !== 0 &&
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
                sx={{ top: "10px", right: "10px" }}
              >
                Stop Meeting
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartMeeting}
                sx={{ top: "10px", right: "10px" }}
              >
                Start Meeting
              </Button>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default VirtualConferenceManagement;
