const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const apiRouter = require('./routes');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World from Node app!');
});


db.authenticate().then(() => {
    console.log('Database connected successfully.');
    return db.sync();
  }).then(() => {
    console.log('Database synchronized successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
