
import { PubSub } from 'graphql-subscriptions';
import { dateScalar } from './schema/data-scalar';
import { ContextValue } from './context';
import { idScalar } from './schema/id-scalar';
const pubsub = new PubSub();

export const resolvers = {
  // Subscription: {

  // },
  Query: {
    exampleQuery: async (_: any, opts: {id: string}, context: ContextValue) => {
      const example = await context.dataSources.example.getExampleById(opts.id);
      return example;
    },
  },
  // Mutation: {
   
  // },
  Example: {
    id: idScalar,
  },
  Date: dateScalar,
};