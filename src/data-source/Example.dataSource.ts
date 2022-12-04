import { MongoDataSource } from 'apollo-datasource-mongodb';
import { IExample } from '../schema/types';
import { toId } from '../util';

export class ExampleDataSource extends MongoDataSource<IExample, any> {
  
  constructor({ collection, model, cache, contextValue }) {
    super(collection);
    super.initialize({ context: this.context, cache });
    this.model = model;
    this.context = contextValue;
  }

  async getExampleById(id: string) {
    const example = await this.findOneById(id);
    return example;
  }

}