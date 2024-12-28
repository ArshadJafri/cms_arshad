"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./HomePageImageSlider.css";

const HomePageImageSlider = ({conferences, height = "80vh" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  const router = useRouter();

  const handleRedirectClick = (view, selectedConferenceIndex) => {
    console.log(selectedConferenceIndex);
    localStorage.setItem('selectedConferenceId', selectedConferenceIndex);
    if(view == "submit-paper"){
      router.push('/submissions');
    }
    if(view == "register"){
      router.push("/registrations");
    }
    
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? conferences.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === conferences.length - 1 ? 0 : prevIndex + 1
    );
  };


  return (
    <div className="slider" style={{ height: height }}>
      <div
        className="slider_content"
        style={{
          backgroundImage: `url("/images/Conference1.jpg")`,
        }}
      >
        <div className="conference_details">
          <h2>{conferences[currentIndex].name}</h2>
          <p>{conferences[currentIndex].location}</p>
          <p>{new Date(conferences[currentIndex].start_date).getDate()}th {monthNames[new Date(conferences[currentIndex].start_date).getMonth()]} {new Date(conferences[currentIndex].start_date).getFullYear()} 
            - {new Date(conferences[currentIndex].end_date).getDate()}th {monthNames[new Date(conferences[currentIndex].end_date).getMonth()]} {new Date(conferences[currentIndex].end_date).getFullYear()}</p>
        </div>

        <div className="button_group">
          <button
            className="submit_paper"
            onClick={() => handleRedirectClick("submit-paper", currentIndex)}
          >
            Submit Paper
          </button>
          <button
            className="register"
            onClick={() => handleRedirectClick("register", currentIndex)}
          >
            Register
          </button>
        </div>

        <button className="arrow left_arrow" onClick={goToPrevious}>
          &#8249;
        </button>

        <button className="arrow right_arrow" onClick={goToNext}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default HomePageImageSlider;
