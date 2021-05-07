'use strict';
const router = require('express').Router();
const _ = require('lodash');
const trace = require('../lib/trace');
const securex = require('../lib/securex');

let moduleName = 'tracer';

let traceCount = 0;
let healthCount = 0;
let healthTraceCount = 0;
let tilesCount = 0;
let tilesTraceCount = 0;
let tilesTileCount = 0;
let tilesTileTraceCount = 0;
let tilesDataCount = 0;
let tilesDataTraceCount = 0;
let respondObservablesCount = 0;
let respondObservablesTraceCount = 0;
let respondTriggerCount = 0;
let deliberateObservablesCount = 0;
let deliberateObservablesTraceCount = 0;
let referObservablesCount = 0;
let referObservablesTraceCount = 0;
let observeObservablesCount = 0;
let observeObservablesTraceCount = 0;

let traceNextHealth = true;
router.post('/health', async (req, res) => {
  healthCount = healthCount + 1;
  if (traceNextHealth) {
    traceNextHealth = false;
    traceCount++;
    healthTraceCount++;
    securex.fetchSecureXAPI('POST', '/iroh/iroh-enrich/health').then(async function (
      res
    ) {
      await trace.storeTracerx('/iroh/iroh-enrich/health', null, res);
      traceNextHealth = true;
    });
  }
  let returnObj = {
    data: {
      status: 'ok',
    },
  };
  await trace.storeTracer(moduleName, '/health', req.body, returnObj);
  res.json(returnObj);
});

let traceNextTiles = true;
router.post('/tiles', async (req, res) => {
  tilesCount++;
  if (traceNextTiles) {
    traceNextTiles = false;
    traceCount++;
    tilesTraceCount++;
    securex.fetchSecureXAPI('GET', '/iroh/iroh-dashboard/tiles').then(async function (
      res
    ) {
      await trace.storeTracerx('/iroh/iroh-dashboard/tiles', null, res);
      traceNextTiles = true;
    });
  }
  let returnObj = {
    data: [
      {
        id: 'trace-stat',
        type: 'markdown',
        title: 'APIs Statistics',
        periods: [],
        short_description: 'Trace APIs for SecureX',
        description: 'Trace APIs for SecureX',
        tags: ['trace'],
      },
    ],
  };
  await trace.storeTracer(moduleName, '/tiles', req.body, returnObj);
  res.json(returnObj);
});

let traceNextTilesTile = true; // Todo
router.post('/tiles/tile', async (req, res) => {
  tilesTileCount++;
  let returnObj = { data: {} };
  switch (req.body.tile_id) {
    case 'trace-stat':
      returnObj = {
        data: {
          description: 'Trace APIs for SecureX',
          periods: [],
          tags: ['trace'],
          type: 'markdown',
          short_description: 'Trace APIs for SecureX',
          title: 'APIs Statistics',
          id: 'trace-stat',
        },
      };
      break;
  }
  await trace.storeTracer(moduleName, '/tiles/tile', req.body, returnObj);
  res.json(returnObj);
});

function replaceDotWithUnderscore(obj) {
  _.forOwn(obj, (value, key) => {
    // if key has a period, replace all occurences with an underscore
    if (_.includes(key, '.')) {
      const cleanKey = _.replace(key, /\./g, '_');
      obj[cleanKey] = value;
      delete obj[key];
    }

    // continue recursively looping through if we have an object or array
    if (_.isObject(value)) {
      return replaceDotWithUnderscore(value);
    }
  });
  return obj;
}

router.post('/tiles/tile-data', async (req, res) => {
  tilesDataCount++;
  securex.fetchSecureXAPI('GET', '/iroh/iroh-dashboard/tiles').then(function (res) {
    for (const tiles of res.data) {
      if (tiles.id != 'trace-stat') {
        traceCount++;
        tilesDataTraceCount++;
        securex.fetchSecureXAPI(
          'GET',
          `/iroh/iroh-dashboard/tiles/${tiles.module_instance_id}/${tiles.id}/data?period=last_24_hours`
        ).then(async function (res) {
          let body = replaceDotWithUnderscore(res); // SecureX have a very bad idea, it include . in key name
          await trace.storeTracerx(
            `/iroh/iroh-dashboard/tiles/${tiles.module_instance_id}/${tiles.id}/data?period=last_24_hours`,
            null,
            body
          );
        });
      }
    }
  });
  let returnObj = { data: {} };
  switch (req.body.tile_id) {
    case 'trace-stat':
      let data = [];
      data.push('|   |   |   |');
      data.push('| - | - | - |');
      data.push(`| Trace | ${traceCount} |`);
      data.push(`| /health | ${healthCount} call(s) | ${healthTraceCount} trace(s) |`);
      data.push(`| /tiles | ${tilesCount} call(s) | ${tilesTraceCount} trace(s) |`);
      data.push(
        `| /tiles/tile | ${tilesTileCount} call(s) | ${tilesTileTraceCount} trace(s) |`
      );
      data.push(
        `| /tiles/tile-data | ${tilesDataCount} call(s) | ${tilesDataTraceCount} trace(s) |`
      );
      data.push(
        `| /respond/observables | ${respondObservablesCount} call(s) | ${respondObservablesTraceCount} trace(s) |`
      );
      data.push(
        `| /respond/trigger | ${respondTriggerCount} call(s) | |`
      );
      data.push(
        `| /deliberate/observables | ${deliberateObservablesCount} call(s) | ${deliberateObservablesTraceCount} trace(s) |`
      );
      data.push(
        `| /refer/observables| ${referObservablesCount} call(s) | ${referObservablesTraceCount} trace(s) |`
      );
      data.push(
        `| /observe/observables| ${observeObservablesCount} call(s) | ${observeObservablesTraceCount} trace(s) |`
      );
      returnObj = {
        data: {
          observed_time: {
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString(),
          },
          valid_time: {
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString(),
          },
          data: data,
          cache_scope: 'user',
        },
      };
      break;
    default:
      returnObj = { data: {} };
  }
  await trace.storeTracer(moduleName, '/tiles/tile-data', req.body, returnObj);
  res.json(returnObj);
});

let traceNextRespondObservalbles = true;
router.post('/respond/observables', async (req, res) => {
  respondObservablesCount++;
  if (traceNextRespondObservalbles) {
    traceNextRespondObservalbles = false;
    traceCount++;
    respondObservablesTraceCount++;
    securex.fetchSecureXAPI('POST', '/iroh/iroh-response/respond/observables', req.body).then(async function (
      res
    ) {
      await trace.storeTracerx(
        '/iroh/iroh-response/respond/observables',
        req.body,
        res
      );
      traceNextRespondObservalbles = true;
    });
  }  
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
  respondTriggerCount++;
  let returnObj = { data: {} };
  await trace.storeTracer(moduleName, '/respond/trigger', req.body, returnObj);
  res.json(returnObj);
});

router.post('/deliberate/observables', async (req, res) => {
  deliberateObservablesCount++;
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
  referObservablesCount++;
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
  observeObservablesCount++;
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
