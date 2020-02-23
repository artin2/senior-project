const { Issuer } = require('openid-client');
Issuer.discover('https://accounts.google.com') // => Promise
  .then(function (googleIssuer) {
    console.log('Discovered issuer %s %O', googleIssuer.issuer, googleIssuer.metadata);
  });

  const client = new googleIssuer.Client({
  client_id: '127645252410-8tui8lsltfpdnumb5s1ha0ft6q6rl8m1.apps.googleusercontent.com',
  client_secret: 'vkfzqwlk4ROk3mGyP0cwq-XM',
  redirect_uris: ['http://localhost:3000/cb'],
  response_types: ['code'], // profile too?
  // id_token_signed_response_alg (default "RS256")
  // token_endpoint_auth_method (default "client_secret_basic")
}); // => Client


const { generators } = require('openid-client');
const code_verifier = generators.codeVerifier();
// store the code_verifier in your framework's session mechanism, if it is a cookie based solution
// it should be httpOnly (not readable by javascript) and encrypted.

const code_challenge = generators.codeChallenge(code_verifier);

client.authorizationUrl({
  scope: 'openid email profile',
  resource: 'https://my.api.example.com/resource/32178',
  code_challenge,
  code_challenge_method: 'S256',
});

const params = client.callbackParams(req);
client.callback('https://client.example.com/callback', params, { code_verifier }) // => Promise
  .then(function (tokenSet) {
    console.log('received and validated tokens %j', tokenSet);
    console.log('validated ID Token claims %j', tokenSet.claims());
  });


  client.userinfo(access_token) // => Promise
  .then(function (userinfo) {
    console.log('userinfo %j', userinfo);
  });

  client.refresh(refresh_token) // => Promise
  .then(function (tokenSet) {
    console.log('refreshed and validated tokens %j', tokenSet);
    console.log('refreshed ID Token claims %j', tokenSet.claims());
  });
