const config = require('./config.js');


module.exports = {
  
  
  
  
  /**
   * This is public, anyone can call it
   */
  handlePublic: function (req, res) {
    console.log("handlePublicEndpoint()");

    let results = {
      "success": true,
      "message": "This is the Public API, Anyone can request this"
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(results));
  },

  
  
  
  
  
  /**
   * This is private, you need a valid JWT to call it
   */
  handlePrivate: function (req, res, oktaJwtVerifier) {
    console.log("-------handlePrivateEndpoint()--------");

    let auth = req.get('Authorization');
    console.log(auth);
    let accessTokenString = "";
    let results = {};

    res.setHeader('Content-Type', 'application/json');

    if(auth) {
      accessTokenString = auth.replace("Bearer ", "");
    }

    oktaJwtVerifier.verifyAccessToken(accessTokenString, config.EXPECTED_AUDIENCE)
    .then(jwt => {
      // the token is valid (per definition of 'valid' above)
      console.log(jwt.claims);
      results = {
        "success": true,
        "message": "This is the private API, Only a valid Okta JWT with a corresponding auth server can see this"
      }

      res.end(JSON.stringify(results));
    })
    .catch(err => {
      // a validation failed, inspect the error
      console.log(err);

      results = {
        "success": false,
        "message": "This is the private API and the token is invalid!"
      }
      res.status(403);

      res.end(JSON.stringify(results));
    });
  },

  
    /**
   * This is private, you will need a valid JWT AND requires a specific claim containing a Login.gov source attribute in the JWT to access this endpoint
   */
  handleScoped: function (req, res, oktaJwtVerifier) {
    console.log("handleScopedEndpoint()");

    let auth = req.get('Authorization');
    let accessTokenString = "";
    let results = {};

    res.setHeader('Content-Type', 'application/json');

    if(auth) {
      accessTokenString = auth.replace("Bearer ", "");
    }

    oktaJwtVerifier.verifyAccessToken(accessTokenString, config.EXPECTED_AUDIENCE)
    .then(jwt => {
      // the token is valid (per definition of 'valid' above)
      console.log(jwt.claims);

      if(jwt.claims["groupclaim"] == "testClaimGroup") {
        results = {
          "success": true,
          "message": "This Private API requires a claim driven by a custom scope, only a valid Okta JWT with the correct claim can see this"
        }  
      } else {
        results = {
          "success": false,
          "message": "This Private API that requires a specific claim to access, please request the appropriate access"
        }
      }
      res.end(JSON.stringify(results));
    })
    .catch(err => {
      // a validation failed, inspect the error
      console.log(err);

      results = {
        "success": false,
        "message": "This is a Scoped API and the token is invalid!"
      }
      res.status(403);

      res.end(JSON.stringify(results));
    });
  },
  
  
  /**
   * This is private, you will need a valid JWT AND requires a specific claim in the JWT to access this endpoint
   */
  handleAccess: function (req, res, oktaJwtVerifier) {
    console.log("handleAccessEndpoint()");

    let auth = req.get('Authorization');
    let accessTokenString = "";
    let results = {};

    res.setHeader('Content-Type', 'application/json');

    if(auth) {
      accessTokenString = auth.replace("Bearer ", "");
    }

    oktaJwtVerifier.verifyAccessToken(accessTokenString, config.EXPECTED_AUDIENCE)
    .then(jwt => {
      // the token is valid (per definition of 'valid' above)
      console.log(jwt.claims);

      if(jwt.claims["access"] == "GRANTED") {
        results = {
          "success": true,
          "message": "This is the private API that requires a specific role to access, Only a valid Okta JWT with the correct claims and a corresponding auth server can see this"
        }  
      } else {
        results = {
          "success": false,
          "message": "This is the access API that requires a specific role to access, 'access' claim is missing the 'GRANTED' value."
        }
      }
      res.end(JSON.stringify(results));
    })
    .catch(err => {
      // a validation failed, inspect the error
      console.log(err);

      results = {
        "success": false,
        "message": "This is the access API and the token is invalid!"
      }
      res.status(403);

      res.end(JSON.stringify(results));
    });
  }
}