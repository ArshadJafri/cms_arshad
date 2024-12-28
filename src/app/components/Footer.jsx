import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_details">
        <p>
          &copy; {new Date().getFullYear()} Conference Management System. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
