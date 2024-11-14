const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const {
    typeDefs: typeDefsBook,
    resolvers: resolversBook,
} = require("./schemas/book");
const {
    typeDefs: typeDefsAuthor,
    resolvers: resolversAuthor,
} = require("./schemas/author");
const {
    typeDefs: typeDefsUser,
    resolvers: resolversUser,
} = require("./schemas/user");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./helpers/jwt");
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs: [typeDefsBook, typeDefsAuthor, typeDefsUser],
    resolvers: [resolversBook, resolversAuthor, resolversUser],
    introspection: true,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context: ({ req }) => {
            return {
                authentication: () => {
                    const authorizationValue = req.headers?.authorization;
                    if (!authorizationValue) {
                        const message = "Invalid token";
                        throw new GraphQLError(message, {
                            extensions: {
                                code: "INVALID_TOKEN",
                                http: {
                                    status: 401,
                                },
                            },
                        });
                    }

                    const [bearer, token] = authorizationValue.split(" ");
                    if (bearer !== "Bearer" || !token) {
                        const message = "Invalid token";
                        throw new GraphQLError(message, {
                            extensions: {
                                code: "INVALID_TOKEN",
                                http: {
                                    status: 401,
                                },
                            },
                        });
                    }

                    const payload = verifyToken(token);
                    return payload;
                },
            };
        },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

startServer();
