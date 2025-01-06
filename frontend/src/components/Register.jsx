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
    background: "#f8f9fa",
    padding: "0 20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    background: "#ffffff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff",
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    paddingRight: "40px",
  },
  icon: {
    position: "absolute",
    right: "10px",
    fontSize: "20px",
    color: "#999",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "none",
    background: "#007bff",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background 0.3s",
  },
  buttonHover: {
    background: "#0056b3",
  },
  linkText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Register;
