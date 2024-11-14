const { GraphQLError } = require("graphql");
const User = require("../model/User");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID!
    email: String!
    #password: String!
    createdAt: String
    updatedAt: String
  }

  type Token {
    access_token: String!
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): Token
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const resolvers = {
    Mutation: {
        register: async (_, args) => {
            const { email, password } = args;
            // if (args.title.length < 3) {
            //     const message = "Title cannot be less than 3 characters";
            //     throw new GraphQLError(message, {
            //         extensions: {
            //             code: "BAD_REQUEST",
            //             http: {
            //                 status: 400,
            //             },
            //         },
            //     });
            // }
            const createdAt = new Date();
            const updatedAt = new Date();
            const userAdded = await User.register(
                email,
                password,
                createdAt,
                updatedAt
            );

            const user = {
                _id: userAdded.insertedId,
                email,
                createdAt,
                updatedAt,
            };
            return user;
        },
        login: async (_, args) => {
            const { email, password } = args;
            const accessToken = await User.login(email, password);
            return accessToken;
        },
    },
};

module.exports = { typeDefs, resolvers };
