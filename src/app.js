const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const ActiveUserController = require('./controllers/ActiveUser');
const loaders = require('./loaders');
const config = require('./config');

config();
loaders();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["https://ieutimetable.vercel.app", "https://ieu.app", "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

let activeUserCount = 0;

io.on('connection', async (socket) => {
    try {
        activeUserCount++;
        const maxActiveUserCount = await ActiveUserController.getMaxActiveUserCount();

        if (activeUserCount > maxActiveUserCount) {
            await ActiveUserController.updateMaxActiveUserCount(activeUserCount);
        }

        io.emit('activeUserCount', activeUserCount);
        io.emit('maxActiveUserCount', await ActiveUserController.getMaxActiveUserCount());

        socket.on('disconnect', async () => {
            try {
                activeUserCount = activeUserCount > 0 ? activeUserCount - 1 : 0;
                io.emit('activeUserCount', activeUserCount);
                io.emit('maxActiveUserCount', await ActiveUserController.getMaxActiveUserCount());
            } catch (error) {
                console.error('Error on socket disconnect:', error);
            }
        });
    } catch (error) {
        console.error('Error on socket connection:', error);
    }
});

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.get('/activeuser', async (req, res) => {
    try {
        const maxActiveUserCount = await ActiveUserController.getMaxActiveUserCount();
        const maxActiveUserTime = await ActiveUserController.getMaxActiveUserTime();

        res.send({
            activeUserCount: activeUserCount,
            maxActiveUserCount: maxActiveUserCount,
            maxActiveUserTime: maxActiveUserTime
        });
    } catch (error) {
        console.error('Error fetching active user data:', error);
        res.status(500).send({ error: 'Failed to fetch active user data' });
    }
});

const PORT = process.env.APP_PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
