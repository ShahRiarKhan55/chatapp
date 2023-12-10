// Importing the CSS file for styling
import "./App.css";
// Importing the socket.io-client library for handling WebSocket connections
import io from "socket.io-client";
// Importing the useState hook from React for managing state in functional components
import { useState } from "react";
// Importing the Chat component from the "./Chat" file
import Chat from "./Chat";

// Creating a WebSocket connection to the server (Assuming the server is running on http://localhost:3001)
const socket = io.connect("http://localhost:3001");

// React functional component for the main application
function App() {
  // State variables for managing username, room, and whether to show the chat component
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Function to handle joining a chat room
  const joinRoom = () => {
    // Checking if both username and room are provided
    if (username !== "" && room !== "") {
      // Emitting a "join_room" event to the server with the room information
      socket.emit("join_room", room);
      // Setting showChat to true to render the Chat component
      setShowChat(true);
    }
  };

  // Rendering the UI based on the showChat state
  return (
    <div className="App">
      {!showChat ? (
        // Rendering the join chat container if showChat is false
        <div className="joinChatContainer">
          <h3>Join Chat</h3>
          {/* Input for entering the username */}
          <input
            type="text"
            placeholder="Adib..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          {/* Input for entering the room ID */}
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          {/* Button to trigger the joinRoom function */}
          <button onClick={joinRoom}> Join A Room</button>
        </div>
      ) : (
        // Rendering the Chat component if showChat is true
        <Chat socket={socket} username={username} room={room}></Chat>
      )}
    </div>
  );
}

// Exporting the App component as the default export
export default App;
