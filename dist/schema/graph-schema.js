export const typeDefs = `#graphql

  scalar Date

  type Query {
    exampleQuery(id: ID!): Example
  }


  type Example {
    id: ID!
  }
`;
//# sourceMappingURL=graph-schema.js.map