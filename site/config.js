// Public configuration only. Never place service API keys in this file.
window.STREAMLAB_CONFIG = Object.freeze({
  // A public HTTPS form endpoint accepting JSON, e.g. a serverless function.
  // No data is sent and no success message is shown until an endpoint is set.
  forms: {
    contactEndpoint: '',
    newsletterEndpoint: ''
  }
});
