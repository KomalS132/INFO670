import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/sendMessage', (req, res) => {
  const { sender, recipient, message } = req.body;
  if (!sender || !recipient || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO messages (sender, recipient, message) VALUES (?, ?, ?)';
  connection.query(query, [sender, recipient, message], (err, result) => {
    if (err) {
      console.error('Error inserting message:', err);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.json({ success: true, messageId: result.insertId });
  });
});

app.get('/retrieveMessages', (req, res) => {
  const { recipient } = req.query;
  if (!recipient) {
    return res.status(400).json({ error: 'Recipient is required' });
  }

  const query = 'SELECT sender, message FROM messages WHERE recipient = ?';
  connection.query(query, [recipient], (err, results) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
    res.json({ messages: results });
  });
});

app.get('/getRecipients', (req, res) => {
    const { sender } = req.query;
    if (!sender) {
        return res.status(400).json({ error: 'Sender username is required' });
    }
    const query = 'SELECT DISTINCT recipient FROM messages WHERE sender = ?';
    connection.query(query, [sender], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const recipients = results.map(row => row.recipient);
        res.json({ recipients });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Make sure to update your .env file with the following variables:`);
  console.log(`PORT - Server port (optional, defaults to 3000)`);
});