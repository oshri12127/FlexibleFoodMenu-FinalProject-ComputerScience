const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/404', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', '404.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'login.html'));
});
app.get('/businessPage', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'businessPage.html'));
});
app.get('', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use('/', (req, res) => {
  res.status(404).redirect('/404');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server on http://localhost:3000');
});
