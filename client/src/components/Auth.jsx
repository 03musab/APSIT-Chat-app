import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
};

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, phoneNumber, avatarURL } = form;

        // Regex for password: At least 8 characters, one uppercase, one lowercase, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Regex for phone number: 10 digits only
        const phoneNumberRegex = /^\d{10}$/;

        if (isSignup) {
            if (!passwordRegex.test(password)) {
                window.alert("Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.");
                return;
            }

            if (!phoneNumberRegex.test(phoneNumber)) {
                window.alert("Phone number must be exactly 10 digits.");
                return;
            }
        }

        const URL = 'http://localhost:5000/auth';

        try {
            const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
                username, password, fullName: form.fullName, phoneNumber, avatarURL,
            });

            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);

            if (isSignup) {
                cookies.set('phoneNumber', phoneNumber);
                cookies.set('avatarURL', avatarURL);
                cookies.set('hashedPassword', hashedPassword);
            }

            window.location.reload();
        } catch (error) {
            console.error("Error during authentication:", error);
            window.alert("An error occurred. Please try again.");
        }
    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    };

    return (
        <div className="auth-page">
            <div className="auth-page__content">
                <div className="auth-page__info">
                    <h1>APSIT Connect is a secure and user-friendly real-time messaging platform.</h1>
                    <p>Designed for seamless communication. It supports both regular and encrypted chats, ensuring privacy and security for users. The app is built with modern web technologies to deliver a fast, responsive, and intuitive user experience.
                    </p>
                </div>
                <div className="auth-page__form">
                    <p className="auth__form-title">{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                            <input 
                                name="username" 
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input 
                                    name="phoneNumber" 
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input 
                                name="password" 
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-button">
                            <button>{isSignup ? 'Sign Up' : 'Sign In'}</button>
                        </div>
                    </form>
                    <div className="auth__form-account">
                        <p>
                            {isSignup
                                ? "Already have an account?"
                                : "Don't have an account?"}
                            <span onClick={switchMode}>
                                {isSignup ? ' Sign In' : ' Sign Up'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
