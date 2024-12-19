const Contact = require('../models/contact.model');

// Submit a contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        res.status(201).json({ message: 'Contact inquiry submitted successfully', contact });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Submit a contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        res.status(201).json({ message: 'Contact inquiry submitted successfully', contact });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all contact inquiries
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

