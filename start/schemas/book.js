const { GraphQLError } = require("graphql");
const Book = require("../model/Book");

const books = [
    {
        id: "1",
        title: "The Awakening",
        // author: ["Kate Chopin", "Paul Auster"],
        author: "Kate Chopin",
    },
    {
        id: "2",
        title: "City of Glass",
        // author: ["Paul Auster", "Kate Chopin"],
        author: "Paul Auster",
    },
];

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    _id: ID!
    title: String!
    #author: [String]
    author: String
  }

  

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    getBookDetail(id: ID!): Book 
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const resolvers = {
    Query: {
        books: async () => {
            const books = await Book.findAll();
            return books;
        },

        getBookDetail: async (_, args) => {
            // console.log(args);
            // const book = books.find((book) => book.id === args.id);
            const book = await Book.findById(args.id);
            if (!book) {
                // throw new Error("Book not found");
                const message = "Book not found";
                throw new GraphQLError(message, {
                    extensions: {
                        code: "NOT_FOUND",
                        http: {
                            status: 404,
                        },
                    },
                });
            }

            return book;
        },
    },

    Mutation: {
        addBook: async (_, args) => {
            if (args.title.length < 3) {
                const message = "Title cannot be less than 3 characters";
                throw new GraphQLError(message, {
                    extensions: {
                        code: "BAD_REQUEST",
                        http: {
                            status: 400,
                        },
                    },
                });
            }

            const bookAdded = await Book.addBook(args.title, args.author);
            const book = {
                _id: bookAdded.insertedId,
                title: args.title,
                author: args.author,
            };
            return book;
        },
    },
};

module.exports = { typeDefs, resolvers };
