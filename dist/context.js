import mongoose from 'mongoose';
import { ExampleDataSource } from './data-source/Example.dataSource';
export class ContextValue {
    constructor({ req, server, connection }) {
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
//# sourceMappingURL=context.js.map