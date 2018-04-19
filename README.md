# Insomnia Plugin - Kraken

Helps authenticate Kraken API requests for development in the RESTful API client [Insomnia](https://insomnia.rest/)

### Install
- Navigate to Insomnia options
- Search for `insomnia-plugin-kraken` in **Plugins**

### Motivation
The Kraken API requires authentication in a way that isn't straightforward to use when you're trying to develop for it. Directly from the Kraken [API Documentation](https://www.kraken.com/help/api#),

Private methods must use POST and be set up as follows:
HTTP header:

```
API-Key = API key
API-Sign = Message signature using HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
```

POST data:

```
nonce = always increasing unsigned 64 bit integer
otp = two-factor password (if two-factor enabled, otherwise not required)
```


### Usage
- The kraken plugin requires some environment variables to be specified.
 - `api_secret` - the secret associated with the above key
 - `otp_override` (optional) If 2FA is enabled, you'll need to set up a static password to use.

With the secret, and optionally the otp override, the plugin calculates the message signature, and sets the `API_Sign` header appropriately for POST requests to the private realm of the Kraken API. 
