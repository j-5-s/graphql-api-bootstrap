import { MongoDataSource } from 'apollo-datasource-mongodb';
import { spawn, exec } from 'child_process';
import util from 'util';
import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import mongoose from 'mongoose';
const execp = util.promisify(exec);
export class TaskRunnerDataSource extends MongoDataSource {
    constructor({ collection, model, cache, contextValue }) {
        super(collection);
        super.initialize({ context: this.context, cache });
        this.model = model;
        this.context = contextValue;
    }
    getTaskRunnerById(id) {
        return this.findOneById(id);
    }
    findOne(opts) {
        return this.model.findOne(opts);
    }
    async createTaskRunner(projectId, props) {
        // @todo
    }
    async createTask(projectId, appId, taskRunnerId, props) {
        const model = await this.findOne({ _id: taskRunnerId });
        const App = mongoose.model('App');
        const Task = mongoose.model('Task');
        const Project = mongoose.model('Project');
        const proj = await Project.findOne({ _id: projectId });
        const app = proj?.apps?.find(app => app._id.toString() === appId);
        if (!app) {
            throw new GraphQLError(`Could not find appId ${appId} in project ${projectId}`, {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT
                }
            });
        }
        const dirName = Buffer.from(Math.random().toString()).toString("base64").substring(10, 15).toLowerCase();
        app.dirName = dirName;
        await proj.save();
        // const command = 'git clone git@github.com:jamescharlesworth/react-typescript-template.git';
        const task = new Task({
            ...props,
        });
        const { command } = props;
        model.tasks.push(task);
        spawn('mkdir', [dirName], { cwd: model.path });
        await model.save();
        return model;
    }
    runSpawn(binary, args, cwd, opts, wait) {
        return new Promise(async (resolve, reject) => {
            const TaskRunner = mongoose.model('TaskRunner');
            const options = {
                _id: opts.taskRunnerId,
                'tasks._id': opts.taskId,
            };
            await TaskRunner.updateOne(options, { $push: {
                    "tasks.$.log": {
                        stream: 'input',
                        text: `${binary} ${args.join(' ')}`,
                        createdAt: new Date(),
                    }
                } });
            const out = spawn(binary, args, {
                cwd,
            });
            out.stderr.on('data', async (text) => {
                await TaskRunner.updateOne(options, { $push: {
                        "tasks.$.log": {
                            stream: 'stderr',
                            text: text.toString(),
                            createdAt: new Date(),
                        }
                    } });
            });
            out.stdout.on('data', async (text) => {
                await TaskRunner.updateOne(options, { $push: {
                        "tasks.$.log": {
                            stream: 'stdout',
                            text: text.toString(),
                            createdAt: new Date(),
                        }
                    } });
            });
            out.stdin.on('data', async (text) => {
                await TaskRunner.updateOne(options, { $push: {
                        "tasks.$.log": {
                            stream: 'stdin',
                            text: text.toString(),
                            createdAt: new Date(),
                        }
                    } });
            });
            out.on('close', (code) => {
                if (wait) {
                    resolve(true);
                }
                console.log(`child process exited with code ${code}`);
            });
            out.on('error', (err) => {
                console.log('error', err);
            });
            if (!wait) {
                resolve(true);
            }
        });
    }
    buildVars(app, runner, task) {
        // app vars
        let vars = [{
                name: '$appName',
                value: app.name,
            }];
        vars = vars.concat(runner.vars);
        vars = vars.concat(task.vars);
        return vars;
    }
    async runTask(projectId, appId, taskRunnerId, taskId) {
        const TaskRunner = mongoose.model('TaskRunner');
        const Project = mongoose.model('Project');
        const project = await Project.findOne({ _id: projectId });
        const app = project.apps.find(app => app._id.toString() === appId);
        if (!app) {
            throw new GraphQLError(`Could not find app ${appId} in project ${projectId}`, {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT
                }
            });
        }
        const runner = await this.findOne({ _id: taskRunnerId });
        const task = runner?.tasks.find(task => task._id.toString() === taskId);
        if (!task) {
            throw new GraphQLError(`Could not find task ${taskId} in runner ${taskRunnerId}`, {
                extensions: {
                    code: ApolloServerErrorCode.BAD_USER_INPUT
                }
            });
        }
        // 
        let { command } = task;
        const vars = this.buildVars(app, runner, task);
        vars.forEach($var => {
            command = command.replace(new RegExp(`\\${$var.name}`, 'g'), $var.value);
        });
        const opts = {
            _id: new mongoose.Types.ObjectId(taskRunnerId),
            'tasks._id': task._id
        };
        // clear previous log
        await TaskRunner.updateOne(opts, { $set: { "tasks.$.log": [] } });
        // make a new sub directory for the task so it does not conflict and can easily be removed
        const cwd = runner.path;
        const parts = command.trim().split(' ');
        const binary = parts.shift();
        this.runSpawn(binary, parts, `${cwd}/${app.dirName}`, { taskRunnerId, taskId });
        return runner;
    }
}
//# sourceMappingURL=TaskRunner.dataSource.js.map