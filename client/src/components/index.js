/**
 * Components Index
 * 
 * This file exports all components for easy importing throughout the application.
 * Import components like: import { ChannelContainer, ChannelSearch } from './components';
 * 
 * As the application grows, consider organizing components into logical groups
 * or splitting into subdirectories with their own index files.
 */

// Channel related components
export { default as ChannelContainer } from './ChannelContainer';
export { default as ChannelSearch } from './ChannelSearch';
export { default as TeamChannelList } from './TeamChannelList';
export { default as TeamChannelPreview } from './TeamChannelPreview';
export { default as ChannelInner } from './ChannelInner';

// Channel management components
export { default as CreateChannel } from './CreateChannel';
export { default as EditChannel } from './EditChannel';

// User related components
export { default as TeamMessage } from './TeamMessage';
export { default as Auth } from './Auth';
export { default as UserList } from './UserList';

// UI components
export { default as ResultsDropdown } from './ResultsDropdown';
export { default as UserProfile } from './UserProfile'; 
export { default as EncryptedChatContainer } from './EncryptedChatContainer';
