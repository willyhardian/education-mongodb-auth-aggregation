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
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs: [typeDefsBook, typeDefsAuthor],
    resolvers: [resolversBook, resolversAuthor],
    introspection: true,
});

async function startServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}

startServer();
