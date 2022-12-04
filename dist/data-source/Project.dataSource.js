import { MongoDataSource } from 'apollo-datasource-mongodb';
export class ExampleDataSource extends MongoDataSource {
    constructor({ collection, model, cache, contextValue }) {
        super(collection);
        super.initialize({ context: this.context, cache });
        this.model = model;
        this.context = contextValue;
    }
    async getExampleBy(id) {
        const example = await this.findOneById(id);
        return example;
    }
}
//# sourceMappingURL=Project.dataSource.js.map