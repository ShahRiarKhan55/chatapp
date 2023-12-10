// Importing necessary React components and hooks
import React, { useEffect, useState } from "react";
// Importing the ScrollToBottom component for automatically scrolling to the bottom of a container
import ScrollToBottom from "react-scroll-to-bottom";

// Functional component for the chat window
function Chat({ socket, username, room }) {
  // State variables for managing the current message and the list of messages
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // Function to send a message
  const sendMessage = async () => {
    // Checking if the current message is not empty
    if (currentMessage !== "") {
      // Creating a message data object with room, author, message, and time
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      // Emitting a "send_message" event to the server with the message data
      await socket.emit("send_message", messageData);
      // Updating the message list with the new message
      setMessageList((list) => [...list, messageData]);
      // Clearing the current message input
      setCurrentMessage("");
    }
  };

  // Effect hook to handle receiving messages from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Updating the message list with the received message data
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  // Rendering the chat window
  return (
    <div className="chat-window">
      {/* Chat header */}
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      {/* Chat body with automatic scrolling */}
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {/* Mapping through the message list and rendering each message */}
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={`${messageContent.room}-${index}`}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  {/* Message content */}
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  {/* Message metadata (time and author) */}
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      {/* Chat footer with input for typing messages and a send button */}
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          // Handling input changes
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          // Handling Enter key press to send messages
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        {/* Button to send messages */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

// Exporting the Chat component as the default export
export default Chat;
