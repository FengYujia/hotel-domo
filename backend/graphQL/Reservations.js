const { gql } = require('apollo-server-express');
const mongodb = require('../mongodb/connect');

// 定义 Reservation Schema
const reservationSchema = gql`
    type Reservation {
        _id: ID!
        email: String!
        phone: String!
        arrivalTime: String!
        tableSize: Int!
        status: Int
        createdAt: String
        updatedAt: String
    }

    type Query {
        reservations: [Reservation]
        reservation(_id: ID!): Reservation
    }

    type Mutation {
        createReservation(email: String!,phone: String, arrivalTime: String, tableSize: Int,status:Int): Reservation
        updateReservation(_id: ID!, email: String,phone: String, arrivalTime: String, tableSize: Int,status:Int): Reservation
        deleteReservation(_id: ID!): Reservation
    }
`;

// 定义 Reservation Resolver
const reservationResolver = {
  Query: {
    reservations: async () => {
      try {
        return await mongodb.Reservation.find();
      } catch (error) {
        throw new Error(`获取预定列表失败: ${error.message}`);
      }
    },
    reservation: async (_, { _id }) => {
      try {
        const reservation = await mongodb.Reservation.findById(_id);
        if (!reservation) {
          throw new Error('预定不存在');
        }
        return reservation;
      } catch (error) {
        throw new Error(`获取预定失败: ${error.message}`);
      }
    }
  },
  Mutation: {
    createReservation: async (_, { email, phone, arrivalTime, tableSize }) => {
      try {
        const reservation = new mongodb.Reservation({
          email,
          phone,
          arrivalTime,
          tableSize,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return await reservation.save();
      } catch (error) {
        throw new Error(`创建预定失败: ${error.message}`);
      }
    },
    updateReservation: async (_, { _id, email, phone, arrivalTime, tableSize }) => {
      try {
        const updatedReservation = await mongodb.Reservation.findByIdAndUpdate(
          _id,
          {
            email,
            phone,
            arrivalTime,
            tableSize,
            updatedAt: new Date().toISOString()
          },
          { new: true }
        );
        if (!updatedReservation) {
          throw new Error('预定不存在');
        }
        return updatedReservation;
      } catch (error) {
        throw new Error(`更新预定失败: ${error.message}`);
      }
    },
    deleteReservation: async (_, { _id }) => {
      try {
        const deletedReservation = await mongodb.Reservation.findByIdAndDelete(_id);
        if (!deletedReservation) {
          throw new Error('预定不存在');
        }
        return deletedReservation;
      } catch (error) {
        throw new Error(`删除预定失败: ${error.message}`);
      }
    }
  }
};

module.exports = {
  reservationSchema,
  reservationResolver
};
