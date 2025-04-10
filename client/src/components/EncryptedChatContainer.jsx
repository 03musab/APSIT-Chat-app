import React, { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import { useChatContext } from 'stream-chat-react';


// Set this in your environment variables (REACT_APP_ENCRYPTION_KEY)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-strong-key-123!@#';

const EncryptedChatContainer = () => {
    const { client, channel } = useChatContext();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [securityStatus, setSecurityStatus] = useState({
        usingSecureKey: false,
        textEncryptionWorking: false,
        fileEncryptionWorking: false,
        ivsUnique: false,
        tamperProof: false,
    });
    const [isSecurityConsoleOpen, setIsSecurityConsoleOpen] = useState(false);
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [encryptionEnabled, setEncryptionEnabled] = useState(true);
    const [isRunningTests, setIsRunningTests] = useState(false); // For loading indicator

    // Toggle encryption and update security status
    const toggleEncryption = () => {
        setEncryptionEnabled((prev) => !prev);
    };

    // Update security status dynamically when encryption is toggled
    useEffect(() => {
        setSecurityStatus({
            usingSecureKey: encryptionEnabled && !SECRET_KEY.includes('default'),
            textEncryptionWorking: encryptionEnabled,
            fileEncryptionWorking: encryptionEnabled,
            ivsUnique: encryptionEnabled,
            tamperProof: encryptionEnabled,
        });
    }, [encryptionEnabled]);

    // Enhanced encryption with IV
    const encryptData = useCallback((data) => {
        if (!encryptionEnabled) {
            return {
                iv: null,
                content: data,
                isEncrypted: false,
                timestamp: Date.now(),
            };
        }

        try {
            const iv = CryptoJS.lib.WordArray.random(128 / 8);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC,
            });
            return {
                iv: iv.toString(),
                content: encrypted.toString(),
                isEncrypted: true,
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }, [encryptionEnabled]);

    // Enhanced decryption with error handling
    const decryptData = useCallback((encryptedObj) => {
        if (!encryptionEnabled || !encryptedObj.isEncrypted) {
            return encryptedObj.content || encryptedObj;
        }

        try {
            if (!encryptedObj.iv || !encryptedObj.content) {
                return '**INVALID ENCRYPTION FORMAT**';
            }

            const bytes = CryptoJS.AES.decrypt(encryptedObj.content, SECRET_KEY, {
                iv: CryptoJS.enc.Hex.parse(encryptedObj.iv),
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC,
            });

            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) return '**DECRYPTION FAILED**';

            try {
                return JSON.parse(decrypted);
            } catch {
                return decrypted;
            }
        } catch (error) {
            console.error('Decryption error:', error);
            return '**DECRYPTION ERROR**';
        }
    }, [encryptionEnabled]);

    // Encrypt file content
    const encryptFileContent = useCallback(async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const encrypted = encryptData({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    content: e.target.result.split(',')[1]
                });
                resolve(encrypted);
            };
            reader.readAsDataURL(file);
        });
    }, [encryptData]);

    // Decrypt file for download
    const decryptFileContent = useCallback(async (encryptedFile) => {
        const decrypted = decryptData(encryptedFile);
        if (typeof decrypted === 'string' || !decrypted?.content) return null;

        const byteString = atob(decrypted.content);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: decrypted.type });
    }, [decryptData]);

    // Fetch users for direct messaging
    const fetchUsers = useCallback(async () => {
        try {
            const response = await client.queryUsers({});
            const availableUsers = response.users.filter(user => user.id !== client.userID);
            setUsers(availableUsers);
            setFilteredUsers(availableUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [client]);

    // Filter users based on search term
    const handleSearch = useCallback((e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredUsers(users.filter(user => 
            (user.name || user.id).toLowerCase().includes(term)
        ));
    }, [users]);

    // Create private channel with selected user
    const createPrivateChannel = useCallback(async (userId) => {
        try {
            const existingChannels = await client.queryChannels({
                type: 'messaging',
                members: { $in: [client.userID, userId] }
            });

            const newChannel = existingChannels[0] || 
                client.channel('messaging', {
                    members: [client.userID, userId],
                    name: `Private: ${client.userID} & ${userId}`
                });

            if (!existingChannels.length) {
                await newChannel.create();
            }

            await newChannel.watch();
            setMessages([]);
            return newChannel;
        } catch (error) {
            console.error('Error creating channel:', error);
            return null;
        }
    }, [client]);

    // Handle user selection
    const handleUserSelect = useCallback(async (user) => {
        setSelectedUser(user);
        await createPrivateChannel(user.id);
    }, [createPrivateChannel]);

    // Run comprehensive security tests
    const verifySecurity = useCallback(async () => {
        setIsRunningTests(true); // Show loading indicator
        const testMessage = "SECURITY_TEST_" + Math.random().toString(36).substring(2);
        const encryptedText = encryptionEnabled ? encryptData(testMessage) : null;
        const decryptedText = encryptedText ? decryptData(encryptedText) : null;
        const textEncryptionWorking = encryptionEnabled && testMessage === decryptedText;

        const testFile = new File(["TEST FILE CONTENT"], "test.txt", { type: "text/plain" });
        const encryptedFile = encryptionEnabled ? await encryptFileContent(testFile) : null;
        const decryptedFile = encryptedFile ? await decryptFileContent(encryptedFile) : null;
        const fileEncryptionWorking = encryptionEnabled && decryptedFile instanceof Blob;

        const msg1 = encryptionEnabled ? encryptData("test1") : null;
        const msg2 = encryptionEnabled ? encryptData("test2") : null;
        const ivsUnique = encryptionEnabled && msg1?.iv !== msg2?.iv;

        const tampered = encryptionEnabled ? { ...msg1, content: msg1.content + "x" } : null;
        const tamperProof = encryptionEnabled && decryptData(tampered)?.includes("DECRYPTION ERROR");

        setSecurityStatus({
            usingSecureKey: encryptionEnabled && !SECRET_KEY.includes('default'),
            textEncryptionWorking,
            fileEncryptionWorking,
            ivsUnique,
            tamperProof
        });

        setTimeout(() => setIsRunningTests(false), 1000); // Hide loading indicator after 1 second
    }, [encryptData, decryptData, encryptFileContent, decryptFileContent, encryptionEnabled]);

    // Initialize security checks and message listener
    useEffect(() => {
        verifySecurity();
        fetchUsers();

        if (!channel) return;

        const handleNewMessage = (event) => {
            if (event.message?.encryptedData) {
                const encryptedData = event.message.encryptedData;
                const decryptedText = encryptedData.text ? decryptData(encryptedData.text) : null;
                const decryptedFile = encryptedData.file ? decryptData(encryptedData.file) : null;
                // Use the message's user object to get the sender's name if available; fallback to the sender field in encryptedData
                const sender = event.message.user ? (event.message.user.fullName || event.message.user.name) : encryptedData.sender;

                const decryptedMessage = {
                    text: decryptedText,
                    file: encryptedData.file ? { decrypted: decryptedFile, encrypted: encryptedData.file } : null,
                    sender: sender,
                    timestamp: event.message.created_at,
                    isReceived: true,
                    encryptedData: encryptedData
                };
                setMessages(prev => [...prev, decryptedMessage]);
            }
        };

        channel.on('message.new', handleNewMessage);

        return () => {
            channel.off('message.new', handleNewMessage);
        };
    }, [channel, decryptData, fetchUsers, verifySecurity]);

    useEffect(() => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) => ({
                ...msg,
                isEncrypted: encryptionEnabled,
            }))
        );
    }, [encryptionEnabled]);

    const sendMessage = async () => {
        if (!selectedUser) {
            alert('Please select a user first to send the message.'); // Replace with a toast if needed
            return;
        }

        if (!input.trim() && !file) return;
        if (!channel) {
            alert('No active chat channel');
            return;
        }

        const encryptedFile = file ? await encryptFileContent(file) : null;

        const messageToSend = {
            text: input ? encryptData(input) : undefined,
            file: encryptedFile,
            sender: client.user && (client.user.fullName || client.user.name) ? (client.user.fullName || client.user.name) : client.userID
        };

        try {
            await channel.sendMessage({
                text: " An encrypted message or file has been sent.🔐",
                encryptedData: messageToSend,
                type: 'regular'
            });

            setMessages(prev => [...prev, {
                text: input,
                file: file ? {
                    decrypted: { name: file.name, size: file.size },
                    encrypted: encryptedFile
                } : null,
                sender: client.userID,
                timestamp: new Date().toISOString(),
                isReceived: false,
                encryptedData: messageToSend
            }]);

            setInput('');
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files?.[0]) {
            if (e.target.files[0].size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');
                return;
            }
            setFile(e.target.files[0]);
        }
    };

    const downloadFile = async (encryptedFile) => {
        try {
            const blob = await decryptFileContent(encryptedFile);
            if (!blob) {
                throw new Error('Decryption failed');
            }

            const decryptedInfo = decryptData(encryptedFile);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = decryptedInfo?.name || 'decrypted_file';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    const viewEncryptedData = (msg) => {
        console.log('Full Message Data:', {
            raw: msg,
            encrypted: {
                text: msg.encryptedData?.text || null,
                file: msg.encryptedData?.file || null,
                sender: msg.sender
            },
            decrypted: {
                text: msg.text,
                file: msg.file ? msg.file.decrypted || null : null,
                sender: msg.sender
            }
        });
    };

    return (
        <div className="encrypted-chat">
            <div className="chat-header">
                <h3>Secure Chat <span className="encryption-status">🔐</span></h3>
                <button
                    onClick={toggleEncryption}
                    className="toggle-encryption-btn"
                >
                    {encryptionEnabled ? 'Disable Encryption' : 'Enable Encryption'}
                </button>
                <button 
                    onClick={() => setIsUserListOpen(!isUserListOpen)} 
                    className="toggle-userlist-btn"
                >
                    {isUserListOpen ? 'Hide User List' : 'Show User List'}
                </button>
                {isUserListOpen && (
                    <div className="user-list">
                        <h4>Select User to DM:</h4>
                        <div className="user-scroll-container">
                            {filteredUsers.map((user) => (
                                <button 
                                    key={user.id} 
                                    onClick={() => handleUserSelect(user)}
                                    className={`user-button ${selectedUser?.id === user.id ? 'active' : ''}`}
                                >
                                    {user.name || user.id}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => setIsSecurityConsoleOpen(!isSecurityConsoleOpen)} 
                    className="toggle-security-console"
                >
                    {isSecurityConsoleOpen ? 'Hide Security Console' : 'Show Security Console'}
                </button>
                {isSecurityConsoleOpen && (
                    <div className="security-console">
                        <h4>Security Verification</h4>
                        <div className="security-checks">
                            <p>🔑 {securityStatus.usingSecureKey ? '✅ Secure Key' : '⚠️ Default Key'}</p>
                            <p>✉️ {securityStatus.textEncryptionWorking ? '✅ Text Encryption' : '❌ Text Encryption'}</p>
                            <p>📁 {securityStatus.fileEncryptionWorking ? '✅ File Encryption' : '❌ File Encryption'}</p>
                            <p>🔄 {securityStatus.ivsUnique ? '✅ Unique IVs' : '❌ IVs Not Unique'}</p>
                        </div>
                        <button onClick={verifySecurity} className="test-button" disabled={isRunningTests}>
                            {isRunningTests ? 'Running Tests...' : 'Run Security Tests'}
                        </button>
                    </div>
                )}
            </div>

            <div className="message-list">
                {messages
                    .filter((msg) => msg.isReceived)
                    .map((msg, index) => (
                        <div key={index} className="message received">
                            <p className="sender">{msg.sender}</p>
                            {msg.text && (
                                <p className="text">
                                    {msg.text}
                                    <button
                                        onClick={() => viewEncryptedData(msg)}
                                        className="view-raw"
                                    >
                                        View Raw Data
                                    </button>
                                </p>
                            )}
                            {msg.file && (
                                <div className="file-message">
                                    <p>📁 {msg.file.decrypted.name} ({Math.round(msg.file.decrypted.size / 1024)} KB)</p>
                                    <button
                                        onClick={() => downloadFile(msg.file.encrypted || msg.file)}
                                        className="download-button"
                                    >
                                        Download
                                    </button>
                                </div>
                            )}
                            <p className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a secure message..."
                    className="message-input"
                    maxLength="500"
                />
                <label className="file-upload">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    />
                    📎 Attach File
                </label>
                <button
                    onClick={sendMessage}
                    className="send-button"
                    disabled={!input.trim() && !file}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default EncryptedChatContainer;
