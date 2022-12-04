import { MongoDataSource } from 'apollo-datasource-mongodb';
export class BuildDataSource extends MongoDataSource {
    constructor({ collection, model, cache, contextValue }) {
        super(collection);
        super.initialize({ context: this.context, cache });
        this.model = model;
        this.context = contextValue;
    }
    getBuildById(id) {
        return this.findOneById(id);
    }
    findOne(opts) {
        return this.model.findOne(opts);
    }
    async createBuild(projectId, props) {
        // @todo
    }
}
//# sourceMappingURL=Build.dataSource.js.map