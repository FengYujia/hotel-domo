'use strict';
const express = require('express');
const router = express.Router();
const ctx = require('../controllers');
const authorize = require('./authorize');

// Export router function
module.exports = function () {
    /** manager **/
    router.post('/manager/login', ctx.manager.login); // Manager login
    router.get('/manager/my', authorize.commom, ctx.manager.my); // Get manager info
    //
    router.get('/manager/reservationList', authorize.commom, ctx.manager.reservationList); //  manager Get reservation info
    router.post('/manager/updateReservation', authorize.commom, ctx.manager.updateReservation); //  manager updatereservation info
    //
    router.get('/manager/guestList', authorize.commom, ctx.manager.guestList); //  manager Get guest info

    /** reservation **/
    router.get('/reservation/list', ctx.reservation.list); // Get reservation info
    router.post('/reservation/create', ctx.reservation.create); // Create reservation
    router.post('/reservation/update', ctx.reservation.update); // Update reservation
    router.post('/reservation/cancel', ctx.reservation.cancel); // cancel reservation

    // Return configured router
    return router;
};
