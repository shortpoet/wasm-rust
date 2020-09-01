import express = require('express');
import { Request } from 'express';
import cors = require('cors');
import { createConnection, getConnection } from "typeorm";
const { graphqlHTTP } = require('express-graphql');
const bodyParser = require('body-parser');

const api = require('./api');
import { generateSchema } from "./utils/generateSchema";
import { buildSchema } from 'type-graphql';
import { isContext } from 'vm';
import { Post } from './graphql/entity/Post';
import { PostsResolver } from './graphql/resolvers/post.resolver';
import { loggingMiddleware } from './middleware/loggingMiddleware';
import { ProjectsResolver } from './graphql/resolvers/project.resolvers';

// const config = require('../ormconfig.js');
require("dotenv").config();
console.log("$# Entity Config @7");


export class Context {
  private readonly req: Request;

  constructor(req: Request) {
    this.req = req;
  }
}

const util = require('util');
(async () => {
  console.log("$# START @7");
  // console.log(config);
  // could insert config as options into createConnection 
  // if need to read from.env to have node modules up a directory 
  const connection = await createConnection();
  // console.log(Object.keys(connection));
  
  // const context = await getConnection().getRepository(Post).find()
  // console.log(context);

  // console.log(`name ${connection.name}`);
  if (connection) {
    // console.log(util.inspect(connection.options, false, null, true /* enable colors */));
    const app = express();
    app.use(cors());

    app.use(loggingMiddleware);
    app.get('/', (request, response) => response.sendStatus(200));
    app.get('/health', (request, response) => response.sendStatus(200));

    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse the raw data
    app.use(bodyParser.raw());
    // parse text
    app.use(bodyParser.text());

    app.use(express.json());

    app.use(api);
    const schema = await generateSchema(PostsResolver, ProjectsResolver);
    app.use('/graphql', graphqlHTTP((req) => ({
      schema,
      graphiql: true,
      // context: req
    })))
    app.listen(process.env.APP_PORT || 5000)
  }
})();