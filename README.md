
# 💬 APSIT Chat App

**APSIT Chat App** is a modern, full-stack real-time messaging platform built with **React** and **Node.js**, designed for secure and seamless communication. Whether you're chatting one-on-one or in group channels, APSIT Chat ensures your conversations stay private with **end-to-end AES encryption**.

## 🚀 Features

* **Real-Time Messaging**
  Instant messaging in both group channels and direct messages using modern WebSocket technology.

* **End-to-End Encryption**
  Messages and file attachments are encrypted using AES to protect privacy and ensure secure communication.

* **User Authentication**
  Secure sign-up and login with token-based authentication to protect user sessions.

* **File Sharing**
  Share encrypted files safely in private or group chats.

* **Clean & Intuitive UI**
  A responsive and user-friendly interface built with React for a smooth user experience across all devices.

* **Cloud Ready**
  Built with scalability in mind—easily deployable on cloud platforms like Render, Vercel, or AWS.

* **Security Console**
  Backend integrity checks, tamper detection, and key validation to protect user data and session security.

## 🛠 Tech Stack

* **Frontend**: React, Tailwind CSS
* **Backend**: Node.js, Express, Stream Chat API
* **Security**: AES Encryption (CryptoJS), JWT Authentication
* **Deployment**: Render (Frontend & Backend), Firebase (optional for auth or storage)

## 📁 Project Structure

* `client/` – React frontend (UI, encryption logic, routing)
* `server/` – Node.js backend (authentication, chat token handling, CORS config)
* `routes/auth.js` – Signup/Login route handlers
* `env` – `.env` file for environment secrets and Stream API keys

## 🔒 Security Highlights

* AES-based message and file encryption
* Session and message tamper detection
* Per-user secret key handling
* Secure file download logic with integrity checks

## ⚙️ Setup Instructions

> *Basic local setup:*

1. Clone the repo

   ```bash
   git clone https://github.com/your-username/apsit-chat-app.git
   ```
2. Install dependencies

   ```bash
   cd server && npm install  
   cd ../client && npm install
   ```
3. Set environment variables in both `/server/.env` and `/client/.env`
4. Run the backend

   ```bash
   cd server && node index.js
   ```
5. Run the frontend

   ```bash
   cd client && npm start
   ```

## 🌐 Live Demo

[Frontend App](https://apsit-chat-frontend.onrender.com)

