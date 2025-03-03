/*  改造exprss路由层捕捉全局错误 */
const Layer = require('express/lib/router/layer');
Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get() {
    return this.__handle;
  },
  set(fn) {
    if (fn.length === 4) {
      this.__handle = fn;
    } else {
      this.__handle = (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch(next);
    }
  }
});


const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { guestSchema, guestResolver } = require('./graphQL/Guest');
const { reservationSchema, reservationResolver } = require('./graphQL/Reservations');
const { managerSchema, managerResolver } = require('./graphQL/Managers');
const restRouter = require('./router/routes');
const basic = require('./router/basic');

// merge Schema and Resolver
const typeDefs = mergeTypeDefs([managerSchema, guestSchema, reservationSchema]);
const resolvers = mergeResolvers([managerResolver, guestResolver, reservationResolver]);

// create GraphQL Schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// create Express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});


app.use(basic.display);

// RESTful API router
app.use('/api', restRouter());


// mount GraphQL middleware
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // enable GraphQL
}));


// 错误处理中间件
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ code: 300, msg: 'server error!' });
});

// 只在直接运行时启动服务器
if (require.main === module) {
  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
    console.log('GraphQL endpoint: http://localhost:4000/graphql');
    console.log('REST API endpoint: http://localhost:4000/api');
  });
}

module.exports = app;

