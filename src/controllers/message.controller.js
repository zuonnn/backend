const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');

const sendMessage = async (req, res) => {
    try {
        // Extract the senderId, receiverId, and message from the request
        const { id: receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;

        // Check if the receiver exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If the conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        // Add the message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save the conversation and the message
        await Promise.all([conversation.save(), newMessage.save()]);

        // Send a success response
        res.status(201).json({
            message: 'Message sent successfully',
            newMessage
        });

    } catch (error) {
        // Send an error response
        console.log('Error in message controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getMessages = async (req, res) => {
    try {
        // Extract the senderId from the request
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        // Check if the conversation exists
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate('messages');

        // If the conversation doesn't exist, return an empty array
        if (!conversation) {
            return res.status(200).json([]);
        }

        // Send the messages
        res.status(200).json({
            messages: conversation.messages
        });

    } catch (error) {
        // Send an error response
        console.log('Error in message controller: ', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    sendMessage,
    getMessages
}
