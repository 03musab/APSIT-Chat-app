import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();

        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

const EditChannel = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([])

    const updateChannel = async (event) => {
        event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);

        if(nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`});
        }

        if(selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);
    }

    const handleDeleteChannel = async () => {
        if(window.confirm("Are you sure you want to delete this channel? This action cannot be undone.")) {
            try {
                await channel.delete();
                // Reload the page after successful deletion
                window.location.reload();
            } catch (error) {
                console.error("Channel deletion failed", error);
                window.alert("An error occurred while deleting the chat. Please try again [ADMIN ONLY].");

            }
        }
    }

    const handleClearChat = async () => {
        if (window.confirm("Are you sure you want to clear all messages in this channel? This action cannot be undone.")) {
            try {
                await channel.truncate(); // Clears all messages in the channel
                window.alert("All messages in the channel have been cleared.");
            } catch (error) {
                console.error("Failed to clear the chat", error);
                window.alert("An error occurred while clearing the chat. Please try again [ADMIN ONLY].");
            }
        }
    };

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
            <div 
                className="edit-channel__button-wrapper" 
                onClick={handleDeleteChannel}
                style={{ marginTop: '10px', backgroundColor: '#E74C3C', cursor: 'pointer' }}
            >
                <p>Delete Channel</p>
            </div>
            <div 
                className="edit-channel__button-wrapper" 
                onClick={handleClearChat}
                style={{ marginTop: '10px', backgroundColor: '#3498DB', cursor: 'pointer' }}
            >
                <p>Clear Chat</p>
            </div>
        </div>
    )
}

export default EditChannel
