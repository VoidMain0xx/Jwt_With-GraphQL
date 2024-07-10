import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        token: String
    }

    type Query {
        me: User
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): User!
        login(email: String!, password: String!): User!
    }
`;

export default typeDefs;
