"use client";
import Login from "./components/Login";
import Footer from "./components/Footer";
import styles from "./page.module.css";
import { useEffect } from "react";

const headerStyles = {
  container: {
    width: "100%",
    padding: "20px",
    backgroundColor: "#007bff",
    color: "white",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "bold",
  },
};

export default function LoginPage() {



  useEffect(() => {

    // window.history.pushState(null, '', window.location.href);


    // const handlePopState = (event) => {

    //   window.history.pushState(null, '', window.location.href);
    // };

    // window.addEventListener('popstate', handlePopState);
    // return () => {
    //   window.removeEventListener('popstate', handlePopState);
    // };
  }, []);

  const Header = () => {
    return (
      <header style={headerStyles.container}>
        <h1 style={headerStyles.title}>Conference Management System</h1>
      </header>
    );
  };
  return (
    <div>
      <Header />
      <Login />
      {/* <Footer/> */}
    </div>
  );
}