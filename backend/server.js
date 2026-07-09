require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/auth');
const courseRoutes  = require('./routes/courses');
const lessonRoutes  = require('./routes/lessons');
const userRoutes    = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/user',    userRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'JonaAcademy API running' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
