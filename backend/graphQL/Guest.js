const { gql } = require('apollo-server-express');
const mongodb = require('../mongodb/connect');

// 定义 Guest Schema
const guestSchema = gql`
    type Guest {
        _id: ID!
        guestName: String!
        phone: String
        email: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        guests: [Guest]
        guest(_id: ID!): Guest
    }

    type Mutation {
        createGuest(guestName: String!,phone: String, email: String): Guest
        updateGuest(_id: ID!, guestName: String,phone: String, email: String): Guest
        deleteGuest(_id: ID!): Guest
    }
`;

// 定义 Guest Resolver
const guestResolver = {
  Query: {
    guests: async () => {
      try {
        return await mongodb.Guest.find();
      } catch (error) {
        throw new Error(`获取用户列表失败: ${error.message}`);
      }
    },
    guest: async (_, { _id }) => {
      try {
        const guest = await mongodb.Guest.findById(_id);
        if (!guest) {
          throw new Error('用户不存在');
        }
        return guest;
      } catch (error) {
        throw new Error(`获取用户失败: ${error.message}`);
      }
    }
  },
  Mutation: {
    createGuest: async (_, { guestName, phone, email }) => {
      try {
        const guest = new mongodb.Guest({
          guestName,
          phone,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return await guest.save();
      } catch (error) {
        throw new Error(`创建用户失败: ${error.message}`);
      }
    },
    updateGuest: async (_, { _id, guestName, phone, email }) => {
      try {
        const updatedGuest = await mongodb.Guest.findByIdAndUpdate(
          _id,
          {
            guestName,
            phone,
            email,
            updatedAt: new Date().toISOString()
          },
          { new: true }
        );
        if (!updatedGuest) {
          throw new Error('用户不存在');
        }
        return updatedGuest;
      } catch (error) {
        throw new Error(`更新用户失败: ${error.message}`);
      }
    },
    deleteGuest: async (_, { _id }) => {
      try {
        const deletedGuest = await mongodb.Guest.findByIdAndDelete(_id);
        if (!deletedGuest) {
          throw new Error('用户不存在');
        }
        return deletedGuest;
      } catch (error) {
        throw new Error(`删除用户失败: ${error.message}`);
      }
    }
  }
};

module.exports = {
  guestSchema,
  guestResolver
};
