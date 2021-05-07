'use strict';
const config = require('config');
const router = require('express').Router();
const trace = require('../lib/trace');

let moduleName = 'base';

router.post('/health', async (req, res) => {
  let returnObj = {
    data: {
      status: 'ok',
    },
  };
  await trace.storeTracer(moduleName, '/health', req.body, returnObj);
  res.json(returnObj);
});

router.post('/tiles', async (req, res) => {
  let returnObj = { data: [] };
  await trace.storeTracer(moduleName, '/tiles', req.body, returnObj);  
  res.json(returnObj);
});

router.post('/tiles/tile', async (req, res) => {
  let returnObj = { data: {} };
  await trace.storeTracer(moduleName, '/tiles/tile', req.body, returnObj);  
  res.json(returnObj);
});

router.post('/tiles/tile-data', async (req, res) => {
  let returnObj = { data: {} };  
  switch (req.body.tile_id) {
    case 'tile_id':
      returnObj = { data: {} }; 
      break;
  }
  await trace.storeTracer(moduleName, '/tiles/tile-data', req.body, returnObj);  
  res.json(returnObj);  
});

router.post('/respond/observables', async (req, res) => {
  let returnObj = { data: [] };
  await trace.storeTracer(
    moduleName,
    '/respond/observables',
    req.body,
    returnObj
  ); 
  res.json(returnObj);
});

router.post('/respond/trigger', async (req, res) => {
  let returnObj = { data: {} };
  await trace.storeTracer(moduleName, '/respond/trigger', req.body, returnObj); 
  res.json(returnObj);
});

router.post('/deliberate/observables', async (req, res) => {
  let returnObj = { data: {} };
  await trace.storeTracer(
    moduleName,
    '/deliberate/observables',
    req.body,
    returnObj
  ); 
  res.json(returnObj);
});

router.post('/refer/observables', async (req, res) => {
  let returnObj = { data: {} };
  await trace.storeTracer(
    moduleName,
    '/refer/observables',
    req.body,
    returnObj
  ); 
  res.json(returnObj);
});

router.post('/observe/observables', async (req, res) => {
  let returnObj = { data: {} };
  await trace.storeTracer(
    moduleName,
    '/observe/observables',
    req.body,
    returnObj
  ); 
  res.json(returnObj);
});

module.exports = router;
