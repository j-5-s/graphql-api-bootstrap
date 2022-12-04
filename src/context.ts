import { IncomingMessage } from 'http';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { ExampleDataSource } from './data-source/Example.dataSource';



type ContextValueProps = {
  req: IncomingMessage;
  server: ApolloServer<ContextValue>,
  connection: mongoose.Connection
}

export class ContextValue {
  public dataSources: {
    example: ExampleDataSource
  }

  constructor({ req, server, connection }: ContextValueProps) {
    // this.token = getTokenFromRequest(req);
    const { cache } = server;
    this.dataSources = {
      example: new ExampleDataSource({
        collection: connection.collection('examples'),
        model: mongoose.model('Example'),
        cache,
        contextValue: this,
      }),
    };
  }
}