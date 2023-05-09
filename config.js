const config = {
  OKTA_HOOK_AUTH:     process.env.HOOK_AUTH,
  EXPECTED_AUDIENCE:  process.env.AUDIENCE, // This is the audience Id of the CIS authorization server
  OKTA_ISSUER:        process.env.ISSUER, // This is the issuer of your CIS custom authorization server
  //OKTA_CLIENT_ID:     process.env.CLIENT_ID, // This is the cliend Id of the UI application in Okta
}

export default config;