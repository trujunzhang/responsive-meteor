import Telescope from 'meteor/nova:lib';
import React from 'react';

const FlashMessages = ({messages}) => {
  return (
    <div className="flash-messages">
      {messages.map((message, index) => <Telescope.components.Flash key={message._id} message={message} index={index}/>)}
    </div>
  );
};

FlashMessages.displayName = "FlashMessages";

module.exports = FlashMessages;