const { ObjectId } = require("mongodb");
const database = require("../config/mongo.js");
class Book {
    static getDatabase() {
        return database.collection("books");
    }

    static async findAll() {
        const books = await this.getDatabase().find().toArray();
        return books;
    }

    static async findById(id) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(id)),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "DigitalBookUserData",
                },
            },
            {
                $unwind: {
                    path: "$DigitalBookUserData",
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ];

        const cursor = database.collection("digitalBooks").aggregate(agg);
        const book = await cursor.toArray();
        // const book = await this.getDatabase().findOne({
        //     _id: new ObjectId(String(id)),
        // });

        return book[0];
    }

    static async addBook(title, author) {
        const book = await this.getDatabase().insertOne({
            title,
            author,
            price: 10000,
        });
        return book;
    }
}

module.exports = Book;
