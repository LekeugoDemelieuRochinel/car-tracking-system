import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/agencies/register', { name, username, password });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed: ' + error.response.data.error);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.form}>
                <h2 style={styles.title}>Register</h2>
                <div style={styles.inputContainer}>
                    <input style={styles.input} type="text" placeholder="Agency Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input style={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button style={styles.button} type="submit">Register</button>
                <p style={styles.linkText}>
                    Already have an account? <span style={styles.link} onClick={() => navigate('/login')}>Login here</span>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f0f0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        background: '#ffffff',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        transition: 'border-color 0.3s',
        fontSize: '16px',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        transition: 'border-color 0.3s',
        fontSize: '16px',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        transition: 'border-color 0.3s',
        fontSize: '16px',
    },
    button: {
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        background: '#007bff',
        color: '#ffffff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    buttonHover: {
        background: '#0056b3',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '14px',
    },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default Register;