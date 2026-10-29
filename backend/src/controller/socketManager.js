import { Server } from "socket.io";

// Stores socket IDs per room
let connections = {};

// Stores messages per room
let messages = {};

// Stores online time of users
let timeOnline = {};

export const connectToSocket = (server) => {
  // Create socket.io server with CORS
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    },
  });
  // When user connects
  io.on("connection", (socket) => {
    /* =========================
           JOIN CALL
        ========================= */
    socket.on("join_call", (path) => {
      // Create room if not exists
      if (connections[path] === undefined) {
        connections[path] = [];
      }

      // Add user to room
      connections[path].push(socket.id);

      // Save join time
      timeOnline[socket.id] = new Date();

      // Notify all users in room
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path]
        );
      }

      // Send previous messages to new user
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; a++) {
          io.to(socket.id).emit(
            "chat-message",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"]
          );
        }
      }
    });

    /* =========================
           WEBRTC SIGNAL
        ========================= */
    socket.on("signal", (toId, signal) => {
      io.to(toId).emit("signal", socket.id, signal);
    });

    /* =========================
           CHAT MESSAGE
        ========================= */
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, Found] = Object.entries(connections).reduce(
        ([room, isFound], [roomkey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomkey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );

      if (Found === true) {
        // create message array if not exists
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        // store message
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        // send message to everyone in the room
        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });
    socket.on("disconnect", () => {
      var diffTime = 0;
      if (timeOnline[socket.id]) {
        diffTime = Math.abs(new Date() - timeOnline[socket.id]);
      }

      var key;

      for (const [k, v] of Object.entries(connections)) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let b = 0; b < connections[key].length; ++b) {
              io.to(connections[key][b]).emit("user-left", socket.id);
            }

            var index = connections[key].indexOf(socket.id);

            connections[key].splice(index, 1);

            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
      // cleanup timeOnline
      if (timeOnline[socket.id]) delete timeOnline[socket.id];
    });
  });

  return io;
};

export default connectToSocket;
