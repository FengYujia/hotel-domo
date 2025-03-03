const mongoose = require('mongoose');
const app = require('../app');
const { beforeAll, afterAll } = require('@jest/globals');

global.__SERVER__ = app; // 直接使用 app 实例

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27020/hotel_test');
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
