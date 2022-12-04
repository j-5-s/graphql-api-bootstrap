import mongoose from 'mongoose';
import { exampleSchema } from './schema/mongo-schema';
let conn = null;
// const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const uri = `mongodb://localhost:27017/${process.env.DB_NAME}`;
console.log(process.env.DB_NAME);
export const getConnection = () => new Promise((resolve, reject) => {
    if (conn == null) {
        try {
            // conn.set('bufferCommands', false);
            conn = mongoose.connection;
            conn.once('open', () => {
                mongoose.model('Example', exampleSchema);
                resolve(conn);
            });
            mongoose.connect(uri);
        }
        catch (ex) {
            throw ex;
        }
    }
    else {
        const c = conn;
        return resolve(c);
    }
});
//# sourceMappingURL=mongo.js.map