# 💬 APSIT Chat App

**APSIT Chat App** is a modern, full-stack real-time messaging platform built with **React** and **Node.js**, designed for secure and seamless communication. Whether you're chatting one-on-one or in group channels, APSIT Chat ensures your conversations stay private with **end-to-end AES encryption**.

![APSIT Chat Demo](https://via.placeholder.com/800x400/6366F1/FFFFFF?text=APSIT+Chat+App+Demo)

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366F1?style=for-the-badge&logo=vercel)](https://apsit-chat-frontend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/03musab/apsit-chat-app)

## 🚀 Features

### Core Functionality
- **⚡ Real-Time Messaging**  
  Instant messaging in both group channels and direct messages using modern WebSocket technology powered by Stream Chat API

- **🔐 End-to-End Encryption**  
  Messages and file attachments are encrypted using AES-256 to protect privacy and ensure secure communication

- **🔑 User Authentication**  
  Secure sign-up and login with JWT token-based authentication to protect user sessions

- **📎 File Sharing**  
  Share encrypted files safely in private or group chats with integrity validation

- **📱 Clean & Intuitive UI**  
  A responsive and user-friendly interface built with React and Tailwind CSS for a smooth experience across all devices

### Advanced Features
- **☁️ Cloud Ready**  
  Built with scalability in mind—easily deployable on cloud platforms like Render, Vercel, or AWS

- **🛡️ Security Console**  
  Backend integrity checks, tamper detection, and key validation to protect user data and session security

- **👥 Group Management**  
  Create, join, and manage group chats with role-based permissions

- **🔔 Real-time Notifications**  
  Instant notifications for new messages and user activities

- **🌙 Dark/Light Mode**  
  Toggle between themes for comfortable usage at any time

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | Core frontend framework | ^18.0.0 |
| Tailwind CSS | Utility-first CSS framework | ^3.3.0 |
| Stream Chat React | Chat UI components | ^11.0.0 |
| CryptoJS | Client-side encryption | ^4.1.1 |
| React Router | Navigation and routing | ^6.8.0 |
| Axios | HTTP client | ^1.3.0 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | ^18.0.0 |
| Express.js | Web application framework | ^4.18.0 |
| Stream Chat | Real-time messaging API | ^8.0.0 |
| JWT | Authentication tokens | ^9.0.0 |
| bcryptjs | Password hashing | ^2.4.3 |
| CORS | Cross-origin resource sharing | ^2.8.5 |
| dotenv | Environment variables | ^16.0.0 |

### Security & Deployment
- **AES-256 Encryption** for message and file security
- **JWT Authentication** for secure user sessions
- **Render** for hosting (Frontend & Backend)
- **Firebase** (optional for additional auth or storage)

## 📁 Project Structure

```
apsit-chat-app/
├── client/                     # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChannelContainer.jsx
│   │   │   │   ├── ChannelListContainer.jsx
│   │   │   │   └── MessageInput.jsx
│   │   │   ├── Security/
│   │   │   │   ├── EncryptionHandler.js
│   │   │   │   └── SecurityConsole.jsx
│   │   │   └── common/
│   │   ├── utils/              # Helper functions
│   │   │   ├── encryption.js
│   │   │   ├── auth.js
│   │   │   └── api.js
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context providers
│   │   ├── styles/             # Global CSS and Tailwind config
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── server/                     # Node.js backend application
│   ├── controllers/
│   │   ├── auth.js             # Authentication logic
│   │   └── chat.js             # Chat functionality
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── security.js         # Security checks
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── chat.js             # Chat routes
│   ├── utils/
│   │   ├── encryption.js       # Server-side encryption
│   │   └── validation.js       # Input validation
│   ├── config/
│   │   ├── database.js         # Database configuration
│   │   └── stream.js           # Stream Chat setup
│   ├── index.js                # Main server file
│   ├── package.json
│   └── .env.example
├── docs/                       # Documentation
├── .gitignore
├── README.md
└── LICENSE
```

## 🔒 Security Highlights

### Encryption & Privacy
- **AES-256 Encryption**: All messages and files are encrypted before transmission
- **Key Management**: Secure per-user encryption key generation and storage
- **Message Integrity**: Hash-based message authentication codes (HMAC) for tamper detection

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Automatic token refresh and secure logout

### Security Monitoring
- **Tamper Detection**: Real-time monitoring for message integrity
- **Rate Limiting**: Protection against spam and abuse
- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Secure cross-origin request handling

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v16+ recommended)
- **npm** or **yarn** package manager
- **Stream Chat Account** ([Get API Key](https://getstream.io/chat/))

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/apsit-chat-app.git
   cd apsit-chat-app
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   **Server Environment** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Stream Chat Configuration
   STREAM_APP_ID=your_stream_app_id
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # Database (if using MongoDB)
   MONGODB_URI=mongodb://localhost:27017/apsit-chat
   
   # Security
   AES_SECRET_KEY=your_32_character_secret_key
   ```

   **Client Environment** (`client/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_STREAM_API_KEY=your_stream_api_key
   REACT_APP_ENCRYPTION_KEY=your_32_character_secret_key
   ```

5. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   # or for production
   npm start
   ```

6. **Start the Frontend Application**
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

### Production Deployment

#### Deploy to Render

**Backend Deployment:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables from your `.env` file

**Frontend Deployment:**
1. Create a new Static Site on Render
2. Set build command: `cd client && npm install && npm run build`
3. Set publish directory: `client/build`
4. Add environment variables

#### Deploy to Vercel (Frontend)
```bash
cd client
npx vercel
```

#### Deploy to Railway/Heroku (Backend)
```bash
# Install CLI and login
cd server
# Follow platform-specific deployment guides
```

## 🧪 Testing

### Run Frontend Tests
```bash
cd client
npm test
```

### Run Backend Tests
```bash
cd server
npm test
```

### Run End-to-End Tests
```bash
npm run test:e2e
```

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with email and password
2. **Login**: Access your account securely
3. **Create/Join Channels**: Start group conversations
4. **Direct Messages**: Chat privately with other users
5. **File Sharing**: Share encrypted files securely
6. **Security Console**: Monitor message integrity and encryption status

### Key Features Usage
- **Creating Channels**: Click "+" button and invite members
- **Encryption Status**: Green lock icon indicates encrypted messages
- **File Upload**: Drag & drop or click to upload encrypted files
- **User Management**: Add/remove users from channels (admin only)

## 🌐 Live Demo

🔗 **[Try APSIT Chat App Live](https://apsit-chat-frontend.onrender.com)**


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure security best practices are followed

## 🐛 Known Issues

- File upload size limit: 10MB per file
- Mobile drag & drop may not work on older devices
- Encryption keys are stored in browser storage (consider hardware security modules for production)

## 📋 Roadmap

- [ ] **Voice Messages**: Record and send encrypted voice notes
- [ ] **Message Reactions**: Emoji reactions and message threading
- [ ] **Desktop App**: Electron-based desktop application
- [ ] **Message Search**: Full-text search across chat history

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Security Considerations

- **Production Keys**: Never commit API keys or secrets to version control
- **HTTPS**: Always use HTTPS in production environments
- **Key Rotation**: Regularly rotate encryption keys and JWT secrets
- **Monitoring**: Implement logging and monitoring for security events
- **Backup**: Regular encrypted backups of user data

### FAQ
**Q: How secure is the encryption?**  
A: We use AES-256 encryption with unique keys per user. All messages are encrypted before leaving your device.

**Q: Can I self-host APSIT Chat?**  
A: Yes! Follow the setup instructions for local deployment.

**Q: Is there mobile app support?**  
A: Currently web-based with responsive design. Native mobile apps are planned for future releases.

## 🙏 Acknowledgments

- [Stream Chat](https://getstream.io/) for providing excellent real-time messaging infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful utility-first CSS framework
- [React](https://reactjs.org/) community for continuous innovation
- APSIT students and faculty for feedback and testing
- All contributors who helped improve this project

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/apsit-chat-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/apsit-chat-app?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/apsit-chat-app)
![GitHub license](https://img.shields.io/github/license/your-username/apsit-chat-app)

---

**💬 APSIT Chat App** — Secure, fast, and reliable communication for everyone.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Powered by Stream](https://img.shields.io/badge/Powered%20by-Stream-005FFF?style=flat-square&logo=stream)](https://getstream.io/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

⭐ **Star this repository if you found it helpful!**
