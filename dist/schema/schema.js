export const typeDefs = `#graphql

  scalar Date

  type Query {
    projectConfig: ProjectConfig
  }

  type Mutation {
    createProject(input: ProjectInput): Project
    deleteProject(id: ID!): ProjectConfig
    updateProject(id: ID!, input: ProjectInput): Project

    createApp(projectId: ID!, input: AppInput): App
    deleteApp(id: ID!): Project
    updateApp(id: ID!, input: AppInput): App
  }

  type Subscription {
    buildEvents(buildId: ID!): EventLog
    buildLogLine(eventLogId: ID!): LogLine
  }

  input AppInput {
    name: String!
  }

  input ProjectInput {
    name: String!
  }

  type ProjectConfig {
    projects: [Project]
    defaultProject: String
  }

  type Project {
    id: ID!
    name: String
    path: String
    apps: [App]
  }

  type App {
    id: ID! 
    name: String
    path: String
    port: Int
  }

  type Build {
    id: ID  
    timestamp: Date
    complete: Boolean
    error: Boolean
    log: [EventLog]
  }
  """
  Execution is a event, like npx create-react-app
  a build likely will have multiple events to complete
  """
  type EventLog {
    id: ID!
    name: String
    complete: Boolean
    error: Boolean
    log: [LogLine]
  }

  type LogLine {
    id: ID!
    text: String
  }
`;
