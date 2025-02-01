import dotenv from "dotenv";
dotenv.config();  // Load environment variables from .env

import axios from 'axios';

// Function to generate a random order ID
function generateOrderId() {
    const prefix = 'Hostelio';
    const randomNumber = Math.random().toString(36).substring(2, 2 + 12); // Generates a random number between 100 and 999
    return prefix + randomNumber;
}

export const createOrder = async (req, res) => {
    try {
        // Generate a random order ID
        const orderId = generateOrderId();

        // Add the generated order ID to the request body
        req.body.order_id = orderId;

        // Convert the modified request body to a JSON string
        const data = JSON.stringify(req.body);

        // Configuration for the Axios request
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sandbox.cashfree.com/pg/orders',
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01'
            },
            data: data
        };

        // Make the request to the Cashfree API
        const response = await axios.request(config);

        // Log the response data

        // Return the response data and status code to the client
        res.status(response.status).json(response.data);
    } catch (error) {
        // Handle errors
        if (error.response) {
            console.error('Error Response:', error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Error:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
};
