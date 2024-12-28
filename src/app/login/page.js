import Login from "../components/Login";
import Footer from "../components/Footer";
export default function LoginPage(){
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