import { PubSub } from 'graphql-subscriptions';
import { dateScalar } from './schema/data-scalar';
const pubsub = new PubSub();
export const resolvers = {
    // Subscription: {
    // },
    Query: {
        exampleQuery: async (_, opts, context) => {
            const example = await context.dataSources.example.getExampleById(opts.id);
            return example;
        },
    },
    // Mutation: {
    // },
    Date: dateScalar,
};
//# sourceMappingURL=resolvers.js.map