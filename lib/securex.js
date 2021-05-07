'use strict';
const config = require('config');
const { Base64 } = require('js-base64');
const fetch = require('node-fetch');

let token = undefined;

function getTokenForAuth() {
  if (!token) {
    return fetch(`${config.get('secureX.url')}/iroh/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Base64.encode(
            `${config.get('secureX.client_id')}:${config.get(
              'secureX.client_secret'
            )}`
          ),
        Accept: 'application/json',
      },
      body: 'grant_type=client_credentials',
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        return JSON.parse(data);
      })
      .then(function (res) {
        token = res;
        setTimeout(function () {
          token = undefined;
        }, res.expires_in * 900); // expire at 90% of ttl
        return res;
      });
  } else {
    return new Promise((resolve, reject) => {
      resolve(token);
    });
  }
}

module.exports = {
  fetchSecureXAPI: function (method, path, body) {
    return new Promise((resolve, reject) => {
      getTokenForAuth().then(function (res) {
        if (body) {
          fetch(`${config.get('secureX.url')}${path}`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + `${res.access_token}`,
              Accept: 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then((response) => response.text())
            .then((data) => JSON.parse(data))
            .then((res) => resolve(res));
        } else {
          fetch(`${config.get('secureX.url')}${path}`, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + `${res.access_token}`,
              Accept: 'application/json',
            },
          })
            .then((response) => response.text())
            .then((data) => JSON.parse(data))
            .then((res) => resolve(res));
        }
      });
    });
  },
};
