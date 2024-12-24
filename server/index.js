const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const typeDefs = `
    type User {
        id: ID!
        name: String!
        username : String!
        email: String!
        phone: String!
        website: String!
    }

    type Todo {
        id: ID!
        title: String!
        completed: Boolean!
        user : User
    }

    type Query {
        getTodos: [Todo]
        getAllUsers : [User]
        getUser(id: ID!): User
    }
`;

const resolvers = {
  Todo: {
    user: async (todo) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${todo.userId}`
      );
      return response.data;
    },
  },
  Query: {
    getTodos: async () =>
      await axios
        .get("https://jsonplaceholder.typicode.com/todos")
        .then((res) => res.data),

    getAllUsers: async () =>
      await axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.data),

    getUser: async (parent, { id }) => {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      return response.data;
    },
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
}

startServer();
