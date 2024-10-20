
module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
  
      // Example: Listen for a 'join_room' event
      socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);
      });
  
      // Example: Listen for 'send_message' event
      socket.on('send_message', (messageData) => {
        console.log('Message received: ', messageData);
        io.to(messageData.roomId).emit('receive_message', messageData);  // Broadcast to room
      });
  
      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };