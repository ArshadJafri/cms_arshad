'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { clearEmail, clearRole, clearUserName } from '../../redux/userSlice'
import { useRouter } from 'next/navigation';
import "./Header.css";

const Header = () => {
  const [activeLink, setActiveLink] = useState("/");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = (link) => {
    console.log(link);
    setActiveLink(link);
  };
  const handleHomeClick = () => {
    router.push('/home');
  };

  const handleLogout = ()=>{
    dispatch(clearEmail());
    dispatch(clearRole());
    dispatch(clearUserName());
  }
  
  return (
    <header className="header">
      <nav className="horizontal_menu">
        <button className="app_title" onClick={handleHomeClick}>
          CMS
        </button>
        <div className="nav_links">
          <Link
            href="/callforpapers"
            onClick={() => handleClick("/callforpapers")}
            className={activeLink === "/callforpapers" ? "active" : ""}
          >
            Call for Papers
          </Link>
          <Link
            href="/submissions"
            onClick={() => handleClick("/submissions")}
            className={activeLink === "/submissions" ? "active" : ""}
          >
            Submissions
          </Link>
          <Link
            href="/schedule"
            onClick={() => handleClick("/schedule")}
            className={activeLink === "/schedule" ? "active" : ""}
          >
            Schedule
          </Link>
          <Link
            href="/registrations"
            onClick={() => handleClick("/registrations")}
            className={activeLink === "/registrations" ? "active" : ""}
          >
            Registration
          </Link>
          <Link
            href="/peerreview"
            onClick={() => handleClick("/peerreview")}
            className={activeLink === "/peerreview" ? "active" : ""}
          >
            Peer Review
          </Link>
          <Link
            href="/virtualconference"
            onClick={() => handleClick("/virtualconference")}
            className={activeLink === "/virtualconference" ? "active" : ""}
          >
            Virtual Conference
          </Link>
          <Link
            href="/mentorship"
            onClick={() => handleClick("/mentorship")}
            className={activeLink === "/mentorship" ? "active" : ""}
          >
            Mentorship
          </Link>
          <Link
            href="/careerresources"
            onClick={() => handleClick("/careerresources")}
            className={activeLink === "/careerresources" ? "active" : ""}
          >
            Career Resources
          </Link>
          <Link
            href="/contactus"
            onClick={() => handleClick("/contactus")}
            className={activeLink === "/contactus" ? "active" : ""}
          >
            Contact Us
          </Link>

          <Link href="/" className="sign_out_btn" onClick={() => handleLogout()}>
            Sign Out
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
