const request = require('supertest');
const mongoose = require('mongoose');
const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

describe('Reservation API', () => {
    let reservationId = '';

    beforeEach(async () => {
        const reservation = await mongoose.connection.collection('reservations').insertOne({
            guestName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            arrivalTime: '2025-08-01',
            tableSize: 6,
            status: 1
        });
        reservationId = reservation.insertedId.toString();
    });

    afterEach(async () => {
        await mongoose.connection.collection('reservations').deleteMany({});
    });

    test('POST /api/reservation/create should create a new reservation', async () => {
        const newReservation = {
            guestName: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '0987654321',
            arrivalTime: '2025-08-02',
            tableSize: 4
        };
        const res = await request(global.__SERVER__).post('/api/reservation/create').send(newReservation);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });

    test('GET /api/reservation/list should return reservations', async () => {
        const res = await request(global.__SERVER__).get('/api/reservation/list?keyword=1234567890');
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('POST /api/reservation/update should update a reservation', async () => {
        const data = { reservationId, arrivalTime: '2025-08-03', tableSize: 8 };
        const res = await request(global.__SERVER__).post('/api/reservation/update').send(data);
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });

    test('POST /api/reservation/cancel should cancel a reservation', async () => {
        const res = await request(global.__SERVER__).post('/api/reservation/cancel').send({ reservationId });
        expect(res.status).toBe(200);
        expect(res.body.code).toBe(200);
    });
});
