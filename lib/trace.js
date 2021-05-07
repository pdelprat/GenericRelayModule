const { tracerModel } = require('../models/tracer.model');
const { tracerxModel } = require('../models/tracerx.model');

module.exports = {
  storeTracer: async function (moduleName, path, requestBody, responseBody) {
    let tracerData = {
      module: moduleName,
      path: path,
      timeStamp: new Date(),
      requestBody: requestBody,
      reponseBody: responseBody,
    };
    const result = await tracerModel.create(tracerData, function (err, small) {
      if (err) return console.log(err);
      // saved!
    });
  },
  storeTracerx: async function (path, requestBody, responseBody) {
    let tracerxData = {
      path,
      timeStamp: new Date(),
      requestBody: requestBody,
      reponseBody: responseBody,
    };
    const result = await tracerxModel.create(
      tracerxData,
      function (err, small) {
        if (err) return console.log(err);
        // saved!
      }
    );
  },
};
