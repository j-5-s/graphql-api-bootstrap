import mongoose from 'mongoose'
import { exampleSchema } from './schema/mongo-schema';
import { IExample } from './schema/types';
let conn: mongoose.Connection | null = null;
// const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
// const uri = `mongodb://localhost:27017/${process.env.DB_NAME}`;
const uri = process.env.MONGODB_URI;

export const getConnection = (): Promise<mongoose.Connection> => new Promise((resolve, reject) => {
  if (conn == null) {
    try {

      // conn.set('bufferCommands', false);
      conn = mongoose.connection;
      conn.once('open', () => {
        mongoose.model<IExample>('Example', exampleSchema);
        resolve(conn!);
      })

      mongoose.connect(uri);

    } catch(ex) {
      throw ex;
    }
  } else {
    const c: mongoose.Connection = conn!;
    return resolve(c)
  }

});

