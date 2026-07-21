require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/auth');
const courseRoutes  = require('./routes/courses');
const lessonRoutes  = require('./routes/lessons');
const userRoutes    = require('./routes/user');
const adminRoutes   = require('./routes/admin');

const app = express();
app.set('trust proxy', 'loopback');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/user',    userRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'JonaAcademy API running' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
