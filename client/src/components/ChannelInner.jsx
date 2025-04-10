import React, { useState } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';

import { ChannelInfo } from '../assets';

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();
  
  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };
    
    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }
    
    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </div>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }) => {
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();

    const handleDeleteDirectMessage = async () => {
      const confirmation = window.confirm("Are you sure you want to delete this chat? This action cannot be undone.");
      
      if (confirmation) {
        try {
          await channel.delete();
          window.location.reload();
        } catch (error) {
          console.log('Error deleting the channel:', error);
        }
      }
    };

    const handleClearChat = async () => {
      const confirmation = window.confirm("Are you sure you want to clear this chat? This action cannot be undone.");
      
      if (confirmation) {
        try {
          await channel.truncate(); // Clears all messages in the channel
          window.alert("Chat has been cleared successfully.");
        } catch (error) {
          console.log('Error clearing the chat:', error);
        }
      }
    };
  
    const MessagingHeader = () => {
      const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      const additionalMembers = members.length - 3;
  
      if(channel.type === 'messaging') {
        return (
          <div className='team-channel-header__name-wrapper'>
            {members.map(({ user }, i) => (
              <div key={i} className='team-channel-header__name-multi'>
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className='team-channel-header__name user'>{user.fullName || user.id}</p>
              </div>
            ))}
  
            {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
            
            <button 
              onClick={handleDeleteDirectMessage}
              style={{
                backgroundColor: '#E74C3C',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                marginLeft: '10px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Delete Chat
            </button>

            <button 
              onClick={handleClearChat}
              style={{
                backgroundColor: '#3498DB',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                border: 'none',
                marginLeft: '10px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Chat
            </button>
          </div>
        );
      }
  
      return (
        <div className='team-channel-header__channel-wrapper'>
          <p className='team-channel-header__name'># {channel.data.name}</p>
          <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
            <ChannelInfo />
          </span>
        </div>
      );
    };
  
    const getWatcherText = (watchers) => {
      if (!watchers) return 'No users online';
      if (watchers === 1) return '1 user online';
      return `${watchers} users online`;
    };
  
    return (
      <div className='team-channel-header__container'>
        <MessagingHeader />
        <div className='team-channel-header__right'>
          <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        </div>
      </div>
    );
  };

  export default ChannelInner;
