
const crypt = require('crypto');
const jsSHA = require("jssha");
const krakenAPI = "https://api.kraken.com";

module.exports.requestHooks = [
  context => {

    // Doubt we'll get sent an invalid context, but you never know
    if (context === null || context === undefined) {
      return;
    }
    // Check that the request is real
    if (!context.hasOwnProperty("request") ||
        context['request'] === null ||
        context['request'] === undefined ||
        context['request'].constructor.name != "Object") {
      return;
    }

    const req = context.request;
    // Check that the request has method getMethod, and that it is a function,
    //  and that, that function returns "POST"
    if (!req.hasOwnProperty("getMethod") ||
        req['getMethod'] == null ||
        req['getMethod'].constructor.name != "Function" ||
        req['getMethod']() != "POST") {
      return;
    }

    // Check that the request has method getUrl, and that it is a function,
    //  and that, that function returns krakenAPI
    if (!req.hasOwnProperty("getUrl") ||
        req['getUrl'] == null ||
        req['getUrl'].constructor.name != "Function" ||
        !req.getUrl().startsWith(krakenAPI)) {
      return;
    }

    // Check that the url contains the word private, we don't want to sign
    //  requests to the public endpoint
    if (!req.getUrl().includes("private")) {
      return;
    }

    // otherwise, and from here, we can assume that this is a valid request,
    //  and also a request that we want to sign.
    var effectiveBody = JSON.parse(req.getBodyText() || "{}");
    var otp = req.getEnvironmentVariable("otp_override");
    if (!effectiveBody.hasOwnProperty("nonce")) {
      effectiveBody['nonce'] = new Date().getTime();
    }
    if (!effectiveBody.hasOwnProperty("otp") && otp != null) {
      effectiveBody['otp'] = otp;
    }
    const nonce = effectiveBody['nonce'];

    if (context.request.getBodyText() != null) {
      context.request.setBodyText(JSON.stringify(effectiveBody, null, 2));
    }

    const path = context.request.getUrl().replace(krakenAPI,"");

    // API-Sign = Message signature using HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
    const key = context.request.getEnvironmentVariable("api_secret");

    var sha256obj = new jsSHA ("SHA-256", "BYTES");
    sha256obj.update (nonce + context.request.getBodyText() || "");
    var hash_digest = sha256obj.getHash ("BYTES");

    var sha512obj = new jsSHA ("SHA-512", "BYTES");
    sha512obj.setHMACKey (key, "B64");
    sha512obj.update (path);
    sha512obj.update (hash_digest);

    context.request.setHeader("API-Sign", sha512obj.getHMAC("B64"))
  }
];
