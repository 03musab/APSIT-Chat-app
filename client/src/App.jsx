import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import { Chat, ChannelList, useChatContext } from "stream-chat-react";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from "./assets/logo.png";

import {
  ChannelContainer,
  Auth,
  EncryptedChatContainer,
  ChannelSearch,
  TeamChannelList,
  TeamChannelPreview,
} from "./components";

import "stream-chat-react/dist/css/index.css";
import "./App.css";

const cookies = new Cookies();
const apiKey = "z85kt2jadq9p";
const authToken = cookies.get("token");
const client = StreamChat.getInstance(apiKey);

// Add helper filter functions copied from ChannelListContainer.jsx
const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === "team");
};

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === "messaging");
};

// Define the inline ChannelListContent component
const ChannelListContent = ({
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setToggleContainer,
}) => {
  const { client } = useChatContext();
  const filters = { members: { $in: [client.userID] } };

  return (
    <div className="channel-content">
      <ChannelSearch setToggleContainer={setToggleContainer} />
      <ChannelList
        filters={filters}
        channelRenderFilterFn={customChannelTeamFilter}
        List={(listProps) => (
          <TeamChannelList
            {...listProps}
            type="team"
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
            setToggleContainer={setToggleContainer}
          />
        )}
        Preview={(previewProps) => (
          <TeamChannelPreview
            {...previewProps}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
            setToggleContainer={setToggleContainer}
            type="team"
          />
        )}
      />
      <ChannelList
        filters={filters}
        channelRenderFilterFn={customChannelMessagingFilter}
        List={(listProps) => (
          <TeamChannelList
            {...listProps}
            type="messaging"
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
            setToggleContainer={setToggleContainer}
          />
        )}
        Preview={(previewProps) => (
          <TeamChannelPreview
            {...previewProps}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
            setToggleContainer={setToggleContainer}
            type="messaging"
          />
        )}
      />
    </div>
  );
};

// Define the inline ChannelListContainer component that uses ChannelListContent
const InlineChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
}) => {
  const [toggleContainer, setToggleContainer] = useState(false);

  return (
    <div className="channel-container">
      <ChannelListContent
        setIsCreating={setIsCreating}
        setCreateType={setCreateType}
        setIsEditing={setIsEditing}
        setToggleContainer={setToggleContainer}
      />
    </div>
  );
};

if (authToken) {
  client.connectUser(
    {
      id: cookies.get("userId"),
      name: cookies.get("username"),
      fullName: cookies.get("fullName"),
      image: cookies.get("avatarURL"),
      hashedPassword: cookies.get("hashedPassword"),
      phoneNumber: cookies.get("phoneNumber"),
    },
    authToken
  );
}

const App = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("fullName");
    cookies.remove("avatarURL");
    cookies.remove("hashedPassword");
    cookies.remove("phoneNumber");
    window.location.reload();
  };

  if (!authToken) return <Auth />;

  return (
    <Router>
      <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <div className="sidebar">

<div className="sidebar__header">
  <img src={logo} alt="Logo" className="sidebar__logo" />
  APSIT Chat
</div>

            {/* Profile Section */}
            <div className="sidebar__profile">
              <div className="sidebar__profile-info">
                <p className="sidebar__profile-name">
                  WELCOME! {cookies.get("fullName") || "Unknown User"}
                </p>
                <p className="sidebar__profile-username">
                  Username: @{cookies.get("username") || "unknown"}
                </p>
              </div>
            </div>

            <Link to="/" className="sidebar__button">
              Regular Chat
            </Link>
            <Link to="/encrypted-chat" className="sidebar__button">
              Encrypted Chat
            </Link>
            <div className="channel-list">
              <InlineChannelListContainer
                setIsCreating={setIsCreating}
                setCreateType={setCreateType}
                setIsEditing={setIsEditing}
              />
            </div>
            <button className="sidebar__logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <ChannelContainer
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    createType={createType}
                  />
                }
              />
              <Route
                path="/encrypted-chat"
                element={<EncryptedChatContainer />}
              />
            </Routes>
          </div>
        </Chat>
      </div>
    </Router>
  );
};

export default App;
