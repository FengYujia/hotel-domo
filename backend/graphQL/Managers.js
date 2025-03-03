const { gql } = require('apollo-server-express');
const mongodb = require('../mongodb/connect');

// 定义 Manager Schema
const managerSchema = gql`
    type Manager {
        _id: ID
        managerName: String!
        phone: String
        managerNo: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        managers: [Manager]
        manager(_id: ID!): Manager
    }

    type Mutation {
        createManager(managerName: String!,phone: String, managerNo: String): Manager
        updateManager(_id: ID!, managerName: String,phone: String, managerNo: String): Manager
        deleteManager(_id: ID!): Manager
    }
`;

// 定义 Manager Resolver
const managerResolver = {
  Query: {
    managers: async () => {
      try {
        return await mongodb.Manager.find();
      } catch (error) {
        throw new Error(`获取用户列表失败: ${error.message}`);
      }
    },
    manager: async (_, { _id }) => {
      try {
        const manager = await mongodb.Manager.findById(_id);
        if (!manager) {
          throw new Error('用户不存在');
        }
        return manager;
      } catch (error) {
        throw new Error(`获取用户失败: ${error.message}`);
      }
    }
  },
  Mutation: {
    createManager: async (_, { managerName, phone, managerNo }) => {
      try {
        const manager = new mongodb.Manager({
          managerName,
          phone,
          managerNo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return await manager.save();
      } catch (error) {
        throw new Error(`创建用户失败: ${error.message}`);
      }
    },
    updateManager: async (_, { _id, managerName, phone, managerNo }) => {
      try {
        const updatedManager = await mongodb.Manager.findByIdAndUpdate(
          _id,
          {
            managerName,
            phone,
            managerNo,
            updatedAt: new Date().toISOString()
          },
          { new: true }
        );
        if (!updatedManager) {
          throw new Error('用户不存在');
        }
        return updatedManager;
      } catch (error) {
        throw new Error(`更新用户失败: ${error.message}`);
      }
    },
    deleteManager: async (_, { _id }) => {
      try {
        const deletedManager = await mongodb.Manager.findByIdAndDelete(_id);
        if (!deletedManager) {
          throw new Error('用户不存在');
        }
        return deletedManager;
      } catch (error) {
        throw new Error(`删除用户失败: ${error.message}`);
      }
    }
  }
};

module.exports = {
  managerSchema,
  managerResolver
};
