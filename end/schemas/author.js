const authors = [
    {
        name: "Kate Chopin",
        books: [
            {
                id: "1",
                title: "The Awakening",
                author: "Kate Chopin",
            },
        ],
    },
];

const typeDefs = `#graphql
  type Author {
    name: String
    books: [Book]
  }

  type Query {
    authors: [Author]
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const resolvers = {
    Query: {
        authors: () => {
            return authors;
        },
    },
};
module.exports = { typeDefs, resolvers };
