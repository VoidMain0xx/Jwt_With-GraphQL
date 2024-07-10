import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import typeDefs from './src/graphQL/typeDefs.js';
import resolvers from './src/graphQL/resolvers.js';
import dotenv from 'dotenv';
import connectDB from './src/config/MongoDB.js'

dotenv.config();

const app = express();

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })
    });
    await server.start();
    server.applyMiddleware({ app });

   connectDB();





   

    app.listen({ port: 3000 }, () => {
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();
