'use strict';
const config = require('config');
const router = require('express').Router();
const trace = require('../lib/trace');
const securex = require('../lib/securex');

let moduleName = 'health';

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
  let returnObj = {
    data: [
      {
        id: 'health-summary',
        type: 'markdown',
        title: 'Summary',
        periods: [],
        short_description: 'A simple health monitor',
        description: 'A simple health monitor',
        tags: ['health'],
      },
    ],
  };
  await trace.storeTracer(moduleName, '/health', req.body, returnObj);
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
    case 'health-summary':
      securex
        .fetchSecureXAPI('POST', '/iroh/iroh-enrich/health') 
            .then(async function (resHealth) {
              let data = [];
              data.push('| | | |');
              data.push('| - | - | - |');
              resHealth.data.forEach((element) => {
                let statusOk = element.data.status == 'ok';
                let statusIcon = statusOk ? '✔' : '✖';
                let statusText = statusOk ? 'Up' : 'Down';
                data.push(
                  `| [${element.module}](${config.get(
                    'secureX.urlSecureX'
                  )}/integrations/${
                    element.module_instance_id
                  }/edit) | ${statusIcon} | ${statusText} |`
                );
              });
              returnObj = {
                data: {
                  valid_time: {
                    start_time: new Date().toISOString(),
                    end_time: new Date().toISOString(),
                  },
                  tile_id: 'health-summary',
                  cache_scope: 'user',
                  period: 'last_hour',
                  observed_time: {
                    start_time: new Date().toISOString(),
                    end_time: new Date().toISOString(),
                  },
                  data: data,
                },
              };
              await trace.storeTracer(
                moduleName,
                '/tiles/tile-data',
                req.body,
                returnObj
              );
              res.json(returnObj);
            });
      break;
    default:
      await trace.storeTracer(
        moduleName,
        '/tiles/tile-data',
        req.body,
        returnObj
      );
      res.json(returnObj);
      break;
  }
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
