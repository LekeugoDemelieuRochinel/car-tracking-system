import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/agencies/register", {
        name,
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      alert("Registration failed: " + error.response.data.error);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Create an Account</h2>
        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="text"
            placeholder="Agency Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div style={styles.passwordContainer}>
            <input
              style={{ ...styles.input, ...styles.passwordInput }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              style={styles.icon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button style={styles.button} type="submit">
          Register
        </button>
        <p style={styles.linkText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #f8f9fa, #e3f2fd)", // Subtle gradient background
    padding: "0 20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Slightly more pronounced shadow
    background: "#ffffff",
    transition: "transform 0.3s ease-in-out",
  },
  formFocus: {
    transform: "scale(1.02)", // Subtle zoom effect when the form is focused
  },
  title: {
    textAlign: "center",
    marginBottom: "30px", // Increased spacing for emphasis
    fontSize: "26px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #007bff, #00c6ff)", // Gradient title for impact
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: "2px 2px 5px rgba(0, 123, 255, 0.4)", // Add some shadow for depth
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px", // Slightly larger gap for a more spacious feel
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px", // Softer, rounder corners
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff", // Bold focus color for inputs
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.3)", // Adding a subtle shadow on focus
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    paddingRight: "40px",
    borderRadius: "8px", // Rounder edges for the password input
  },
  icon: {
    position: "absolute",
    right: "10px",
    fontSize: "20px",
    color: "#999",
    cursor: "pointer",
    transition: "color 0.3s", // Smooth transition when hovering over icon
  },
  iconHover: {
    color: "#007bff", // Highlight icon color on hover
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px", // Softer, rounder corners
    border: "none",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600", // Slightly bolder font weight
    background: "linear-gradient(135deg, #007bff, #00c6ff)", // Gradient button for a modern look
    cursor: "pointer",
    marginTop: "30px", // Larger gap above button
    transition: "background 0.3s, transform 0.2s, box-shadow 0.3s", // Smooth transition effects
    boxShadow: "0 6px 15px rgba(0, 123, 255, 0.3)", // Subtle shadow for depth
  },
  buttonHover: {
    background: "linear-gradient(135deg, #00c6ff, #007bff)", // Reversed gradient on hover
    transform: "scale(1.05)", // Slight scale effect on hover
    boxShadow: "0 8px 20px rgba(0, 123, 255, 0.4)", // Increased shadow effect on hover
  },
  linkText: {
    textAlign: "center",
    marginTop: "20px", // More space to separate link from form
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.3s",
  },
  linkHover: {
    color: "#00c6ff", // Lighter blue on hover for links
  },
};


export default Register;
