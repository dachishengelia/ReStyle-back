const express = require('express');
const app = express();

// Optional: parse JSON requests
app.use(express.json());

// Example: placeholder route for all empty files
app.all('*', (req, res) => {
  res.status(200).json({ message: 'Route exists, but logic not implemented yet.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
