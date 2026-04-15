const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { from, to, text, fileName, video, resource } = req.body;

    const newMessage = new Message({
      from,
      to,
      text,
      fileName,
      video,
      resource,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessagesForStudent = async (req, res) => {
  try {
    const studentName = req.params.studentName;
    const messages = await Message.find({ to: studentName }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
