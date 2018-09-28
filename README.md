# Insomnia Plugin - HMAC

Helps authenticate API requests for development in the RESTful API client [Insomnia](https://insomnia.rest/) that require HMAC authentication

### Install
- Navigate to Insomnia options
- Search for `insomnia-plugin-hmac` in **Plugins**

### Motivation
By default, Insomnia doesn't support HMAC authentication. This makes it difficult to work with APIs using this form of authentication.

Private methods must use POST or PUT and be set up as follows:
HTTP header:

```
X-Auth-Signature = Message signature using HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
X-Auth-Timestamp
X-Auth-Version
```

### Usage
- The plugin requires some environment variables to be specified.
 - `key-id`
 - `shared-secret`
