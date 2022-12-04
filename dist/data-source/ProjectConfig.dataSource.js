import { MongoDataSource } from 'apollo-datasource-mongodb';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { toId } from '../util';
export class ProjectConfigDataSource extends MongoDataSource {
    constructor({ collection, model, cache, contextValue }) {
        super(collection);
        super.initialize({ context: this.context, cache });
        this.model = model;
        this.context = contextValue;
    }
    async getProjectById(id) {
        const projectConfig = await this.findOneById(id);
        return toId(projectConfig);
    }
    findOne(opts) {
        return this.model.findOne(opts);
    }
    async createProject(projectConfigId, props) {
        const projectConfig = await this.model.findById(projectConfigId);
        if (!projectConfig) {
            throw new GraphQLError('Invalid argument value', {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT
                }
            });
        }
        const project = new this.context.dataSources.project.model(props);
        await project.save();
        projectConfig.projects.push(project);
        await projectConfig.save();
        return projectConfig;
    }
}
//# sourceMappingURL=ProjectConfig.dataSource.js.map