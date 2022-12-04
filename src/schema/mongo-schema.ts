import { Schema } from 'mongoose';
import { IExample  } from './types';


export const exampleSchema = new Schema<IExample>({
  id: String
});

