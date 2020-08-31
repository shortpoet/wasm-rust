const fs = require('fs')
const path = require('path')
const express = require('express');
import { Request, Response } from 'express';
import { router } from ".";
// const { say } = require('../../hello-world/pkg/ssvm_nodejs_starter_lib.js');
import { say } from '../../wasm/hello-world/pkg/ssvm_nodejs_starter_lib.js';
import { chalkLog } from '../utils/chalkLog';

const http = require('http');
const url = require('url');
const hostname = '127.0.0.1';
const port = 8080;

router.get('/', (request: Request, response: Response) => {
  response.set({
    'Content-Type': 'text/plain'
  })
  const queryObject = url.parse(request.url,true).query;
  console.log(request.url);
  if (!queryObject['name']) {
    chalkLog('magenta', `/api/hello with NO param`)
    response.end(`Please use command curl http://${hostname}:${port}/say/?name=MyName \n`);
  } else {
    chalkLog('magenta', `/api/hello with param ${queryObject['name']}`)
    // response.json(say(queryObject['name']) + '\n');
    response.end(say(queryObject['name']) + '\n');
  }
});

// https://stackoverflow.com/questions/27465850/typeerror-router-use-requires-middleware-function-but-got-a-object
module.exports = router;
