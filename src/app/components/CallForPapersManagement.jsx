"use client";
import React, { useState } from "react";
import "./CallForPapersManagement.css";

const CallForPapersManagement = ({ conferences }) => {
  const [selectedConferenceId, setSelectedConferenceId] = useState(0);
  const [submission_guidelines,setSubmission_Guidelines] = useState("");
  const [importantDates, setImportantDates] = useState([{event_name: "", event_date: ""}]);
  const [faqs, setFaqsList] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleConferenceChange = (e) => {
    setSelectedConferenceId(e.target.value);
    console.log(e.target.value);
    setSubmission_Guidelines("");
    setImportantDates([{ event_name: "", event_date: "" }]);
    setFaqsList([]);
  };

  const handleAddImportantDate = () => {
    console.log(selectedConferenceId);
    setImportantDates([...importantDates, { event_name: "", event_date: "" }]);
  };

  const handleDateChange = (index, field, value) => {
    const updatedImportantDates = importantDates.map((date, i) =>
      i === index ? { ...date, [field]: value } : date
    );
    setImportantDates(updatedImportantDates);
  };

  const handleAddFaq = () => {
    setFaqsList([...faqs, { question: newQuestion, answer: newAnswer }]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleDeleteFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqsList(updatedFaqs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/callforpapers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'conference_id':selectedConferenceId,
        submission_guidelines,
        importantDates,
        faqs
      }),
    });
    
    const data = await response.json();

    alert(data.message);
    
    setSelectedConferenceId("");
    setSubmission_Guidelines("");
    setImportantDates([{ event_name: "", event_date: "" }]);
    setFaqsList([]);
  };

  return (
    <div className="call_for_papers_management">
      <h2>Manage Call for Papers</h2>

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

      <form onSubmit={handleSubmit} className="call_for_papers_form">
        <div className="form_group">
          <label>Submission Guidelines <span> (Seperate the guidelines with comma)</span></label>
          <textarea
            value={submission_guidelines}
            onChange={(e) => setSubmission_Guidelines(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="dates_section">
          <h3>Important Dates:</h3>
          {importantDates.map((date, index) => (
            <div key={index} className="date_row">
              <div className="form_group">
                <label>Event Name:</label>
                <input
                  type="text"
                  value={date.event_name}
                  onChange={(e) =>
                    handleDateChange(index, "event_name", e.target.value)
                  }
                  style={{width:"300px"}}
                  required
                />
              </div>
              <div className="form_group">
                <label>Event Date</label>
                <input
                  type="date"
                  value={date.event_date}
                  onChange={(e) =>
                    handleDateChange(index, "event_date", e.target.value)
                  }
                  required
                />
              </div>
              
            </div>
          ))}
          <button type="button" onClick={handleAddImportantDate}>
            Add Date
          </button>
        </div>

        <div className="faq_section">
          <h3>Manage FAQs</h3>
          <div className="form_group">
            <label>New FAQ Question:</label>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter question"
            />
          </div>
          <div className="form_group">
            <label>New FAQ Answer:</label>
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter answer"
            />
          </div>
          <button type="button" onClick={handleAddFaq}>
            Add FAQ
          </button>

          <ul className="faq_list">
            {faqs.map((faq, index) => (
              <li key={index}>
                <strong>Q: {faq.question}</strong>
                <p>A: {faq.answer}</p>
                <button onClick={() => handleDeleteFaq(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Save Call for Papers</button>
      </form>
    </div>
  );
};

export default CallForPapersManagement;
