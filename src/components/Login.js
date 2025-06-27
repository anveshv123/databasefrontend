import React, { useState } from 'react';
import '../CSS/logincss.css';
import { FaUser, FaEye, FaEyeSlash  } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {login} from '../service/apiService';

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };


    const handleLogin = async (event) => {
        event.preventDefault();

        // Reset errors
        setUsernameError('');
        setPasswordError('');
        setErrorMessage('');

        // Validate inputs
        if (!username.trim()) {
            setUsernameError('Username is required');
        
        }
        if (!password.trim()) {
            setPasswordError('Password is required');
            
        }

        try {
            // console.log(username,password);

            const result = await login(username, password);
            navigate('/Search');

        } catch (error) {
            setErrorMessage(error.message || 'An error occurred during login. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className='icon' />
                    </div>
                    {usernameError && <p className="error-message">{usernameError}</p>}
                    
                    <div className="input-box">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* <FaLock className='icon' /> */}
                        {showPassword ? (
                            <FaEye className='icon' onClick={togglePasswordVisibility} />
                        ) : (
                            <FaEyeSlash className='icon' onClick={togglePasswordVisibility} />
                        )}
                    </div>
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;