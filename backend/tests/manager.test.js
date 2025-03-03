const request = require('supertest');
const mongoose = require('mongoose');
const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

describe('Manager API', () => {
    let token;
    let reservationId = '';

    beforeEach(async () => {
        // 插入管理员测试数据
        await mongoose.connection.collection('managers').insertOne({
            managerName: 'root',
            managerNo: '0001',
            phone: '123456789',
            password: 'C66B1895749F096600B1DFBC75A5B6CB2DC38667B253CD564FA0AFE848F0F557'
        });
        // 插入预订测试数据
        const reservation = await mongoose.connection.collection('reservations').insertOne({
            guestName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            arrivalTime: '2025-08-01', // 修正日期格式
            tableSize: 8,
            status: 1
        });
        reservationId = reservation.insertedId.toString();
    });

    afterEach(async () => {
        await mongoose.connection.collection('managers').deleteMany({});
        await mongoose.connection.collection('reservations').deleteMany({});
    });

    test('POST /api/manager/login should return an manager info', async () => {
        const res = await request(global.__SERVER__).post('/api/manager/login').send({
            managerNo: '0001',
            password: '123456'
        });
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(res.body.data).toHaveProperty('token');
        token = res.body.data.token;
    });

    test('GET /api/manager/my should return an manager info', async () => {
        const res = await request(global.__SERVER__)
            .get('/api/manager/my')
            .set('token', token);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });

    test('GET /api/manager/guestList should return an guest array', async () => {
        const res = await request(global.__SERVER__)
            .get('/api/manager/guestList')
            .set('token', token);
        expect(res.body.code).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/manager/reservationList should return an reservation array', async () => {
        const res = await request(global.__SERVER__)
            .get('/api/manager/reservationList')
            .set('token', token);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/manager/updateReservation should return an ok message', async () => {
        const res = await request(global.__SERVER__)
            .post('/api/manager/updateReservation')
            .set('token', token)
            .send({
                reservationId,
                status: -1
            });
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });
});
