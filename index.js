/* eslint-disable no-prototype-builtins, new-cap */

const CryptoJS = require('crypto-js');

function encodeURL(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_');
}

function computeHttpSignature(msg, key) {
  const hash = CryptoJS.HmacSHA256(msg, key);
  const hashInBase64 = encodeURL(CryptoJS.enc.Base64.stringify(hash));

  return hashInBase64;
}

function computeSigningBase(req, date) {
  console.log('computing signing base');
  const { method } = req;
  console.log('trimming target url');
  let targetUrl = req.getUrl().trim(); // there may be surrounding ws
  console.log('stripping hostname');
  targetUrl = targetUrl.replace(new RegExp('^https?://[^/]+/'), '/'); // strip hostname
  console.log('creating signing base');
  const signingBase = `${method}\n${date}\n${targetUrl}`;
  console.log('returning');
  return signingBase;
}

module.exports.requestHooks = [
  (context) => {
    console.log('start');
    const timestamp = new Date().toISOString();
    const message = computeSigningBase(context.request, timestamp);
    console.log('getting sharedSecret');
    const key = context.request.getEnvironmentVariable('sharedSecret');
    const signature = computeHttpSignature(message, key);

    console.log('setting headers');
    context.request.setHeader('X-Auth-Timestamp', timestamp);
    context.request.setHeader('X-Auth-Signature', signature);
    context.request.setHeader('X-Auth-Version', 1);
    console.log(timestamp);
    console.log(signature);
    const headers = context.request.getHeaders();
    console.log(JSON.stringify(headers));
  },
];
