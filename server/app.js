import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002; // Updated port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'system',
        content: 'You are a very helpful assistant',
      },
    ],
  };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        ...data,
        ...messages,
      }),
    });

    const resData = await response.json();
    console.log(resData);
    res.send(resData);
  } catch (error) {
    console.log(error, "Error");
    res.status(500).send("Server Error");
  }
});

// Start the server with error handling
app.listen(port, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Server running at http://localhost:${port}`);
  }
});
