import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import upload from 'express-fileupload';
import cookieParser from 'cookie-parser';

// Error Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// DB File
import { connectDB } from './lib/db.js';

// Routes
import voterRoutes from './routes/voterRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import voteRoutes from './routes/voteRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: [process.env.FRONTEND_URL] }));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(upload());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', voterRoutes);
app.use('/api', electionRoutes);
app.use('/api', candidateRoutes);
app.use('/api', voteRoutes);

// Error Handling Middleware - always place after all routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
