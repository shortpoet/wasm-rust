import express = require('express');
import { Request } from 'express';
import cors = require('cors');
import { createConnection, getConnection } from "typeorm";
const { graphqlHTTP } = require('express-graphql');

import { generateSchema } from "./utils/generateSchema";
import { buildSchema } from 'type-graphql';
import { isContext } from 'vm';
import { Post } from './entity/Post';
import { PostResolver } from './resolvers/post.resolver';
import { loggingMiddleware } from './middleware/loggingMiddleware';

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
  const context = await getConnection().getRepository(Post).find()
  console.log(context);
  
  // console.log(`name ${connection.name}`);
  if (connection) {
    // console.log(util.inspect(connection.options, false, null, true /* enable colors */));
    const app = express();
    app.use(cors());
    
    app.use(loggingMiddleware);
    const schema = await generateSchema(PostResolver);
    app.use('/graphql', graphqlHTTP((req) => ({
      schema,
      graphiql: true,
      // context: req
    })))
    app.listen(process.env.APP_PORT || 5000)
  }
})();