const logger = require('../logger/logger');
const mongoose = require('mongoose');
const config = require('config');

// 设置 mongoose 配置
mongoose.set('strictQuery', true);
mongoose.set('returnOriginal', false);

class DatabaseConnection {
    constructor() {
        this.retryCount = 0;
        this.maxRetries = 30;
        this.retryInterval = 5000; // 5秒
        this.isConnected = false;
    }

    async connect() {
        const options = {
            ...config.mongodb.opts,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 2000, // 心跳检测频率
            keepAlive: true, // 保持连接
            keepAliveInitialDelay: 300000 // 保活初始延迟
        };

        try {
            await mongoose.connect(config.mongodb.url, options);
            this.isConnected = true;
            this.retryCount = 0;
            logger.info('[MongoDB] Connected successfully!');
            this.setupEventListeners();
        } catch (err) {
            logger.error(`[MongoDB] Connection error: ${err.message}`);
            await this.handleConnectionError();
        }
    }

    async handleConnectionError() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            logger.info(`[MongoDB] Retrying connection... Attempt ${this.retryCount} of ${this.maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, this.retryInterval));
            await this.connect();
        } else {
            logger.error('[MongoDB] Max retry attempts reached. Please check your database connection.');
            process.exit(1); // 可选：在无法连接数据库时退出应用
        }
    }

    setupEventListeners() {
        mongoose.connection.on('disconnected', () => {
            this.isConnected = false;
            logger.error('[MongoDB] Disconnected from database');
            if (this.retryCount < this.maxRetries) {
                this.connect();
            }
        });

        mongoose.connection.on('reconnected', () => {
            this.isConnected = true;
            logger.info('[MongoDB] Reconnected to database');
        });

        mongoose.connection.on('error', (err) => {
            logger.error(`[MongoDB] Connection error: ${err.message}`);
        });

        // 优雅关闭连接
        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }

    async gracefulShutdown() {
        try {
            await mongoose.connection.close();
            logger.info('[MongoDB] Connection closed through app termination');
            process.exit(0);
        } catch (err) {
            logger.error(`[MongoDB] Error during graceful shutdown: ${err.message}`);
            process.exit(1);
        }
    }

    getModels() {
        const Guest = mongoose.model('Guest', require('./models/Guest'), 'guest');
        const Manager = mongoose.model('Manager', require('./models/Manager'), 'managers');
        const Reservation = mongoose.model('Reservation', require('./models/Reservation'), 'reservations');

        // 扩展查询方法，使其默认返回普通对象
        ['find', 'findOne', 'findById'].forEach(method => {
            const originalMethod = Guest[method];
            Guest[method] = function (...args) {
                return originalMethod.apply(this, args).lean();
            };
            Manager[method] = function (...args) {
                return originalMethod.apply(this, args).lean();
            };
            Reservation[method] = function (...args) {
                return originalMethod.apply(this, args).lean();
            };
        });

        return { Guest, Manager, Reservation };
    }
}

const dbConnection = new DatabaseConnection();
dbConnection.connect();

module.exports = dbConnection.getModels();

