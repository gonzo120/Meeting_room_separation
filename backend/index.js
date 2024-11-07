const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/room');
const reservationRoutes = require('./routes/reservation');

const errorController = require('./controllers/error');

const app = express();

const ports = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, no-auth');
 next();
});

app.use('/auth', authRoutes);
app.use('/auth', roomRoutes);
app.use('/auth', reservationRoutes);

app.use(errorController.get404);

app.use(errorController.get500);
app.listen(ports, () => {
  console.log(`Server running on port ${ports}`);
});