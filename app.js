const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config()
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));

// if (process.env.NODE_ENV === 'production') {
//   app.use('/', express.static(path.join(__dirname, 'client', 'build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.request(__dirname, 'client', 'build', 'index.html'));
//   });
// }

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
