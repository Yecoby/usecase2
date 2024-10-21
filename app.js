const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan'); // For logging requests
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const branchRoutes = require('./routes/branch.routes');

dotenv.config();
const app = express();

console.log("Starting server...");

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Log requests to the console

console.log("Using routes...");
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/users', userRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized...');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Closed out remaining connections.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Forcing shutdown.');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});