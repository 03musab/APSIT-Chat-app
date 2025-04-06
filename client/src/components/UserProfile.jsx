import React from 'react';
import { useChatContext } from 'stream-chat-react';

const UserProfile = () => {
    const { client } = useChatContext(); // Access the current user from the chat context
    const { fullName } = client.user || {}; // Destructure user details

    return (
        <div className="user-profile">
          
            <div className="user-profile__details">
                <p className="user-profile__name">Welcome {fullName || 'Anonymous User'} !</p>
            </div>
        </div>
    );
};

export default UserProfile;