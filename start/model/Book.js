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
        const book = await this.getDatabase().findOne({
            _id: new ObjectId(String(id)),
        });
        return book;
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
