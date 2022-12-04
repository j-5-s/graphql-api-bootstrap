import { MongoDataSource } from 'apollo-datasource-mongodb';
export class ExampleDataSource extends MongoDataSource {
    constructor({ collection, model, cache, contextValue }) {
        super(collection);
        super.initialize({ context: this.context, cache });
        this.model = model;
        this.context = contextValue;
    }
    async getExampleById(id) {
        const example = await this.findOneById(id);
        return example;
    }
}
//# sourceMappingURL=Example.dataSource.js.map