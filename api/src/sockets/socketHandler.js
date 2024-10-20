const prisma = require("./../models/index");

module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log(`New client connected: ${socket.id}`);
  
      // Example: Listen for a 'join_room' event
      socket.on('join_room', (roomId) => {
        console.log(`User joined room: ${roomId}`);
        socket.join(roomId);
      });
  
      // Example: Listen for 'send_message' event
      socket.on('send_message', async (messageData) => {
        const { content, senderId, groupId } = messageData;

        try {
            // Save the message to the database using Prisma
            const newMessage = await prisma.message.create({
            data: {
                content: content,
                sender: {
                    connect: { id: parseInt(senderId) }  // Connect sender using their ID
                },
                group: {
                    connect: { id: parseInt(groupId) }  // Connect the message to the group
                },
                seenBy: [parseInt(senderId)]  // Mark the sender as having seen the message
            }
            });

            const roomId = messageData.groupId;
            io.to(roomId).emit('receive_message', {
                id: newMessage.id,
                content: newMessage.content,
                senderId: newMessage.senderId,
                groupId: newMessage.groupId,
                seenBy: newMessage.seenBy,
                createdAt: newMessage.createdAt,
            });
        } catch (error) {
            console.log('Error creating message: ', error);
        }});
  
      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
      });
    });
  };