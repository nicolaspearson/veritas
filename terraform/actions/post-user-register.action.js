const axios = require('axios');

/**
 * Handler that will be called during the execution of the post-user-registration flow.
 *
 * @param event The event object for the post-user-registration Actions trigger provides contextual
 * information about the newly-created user.
 *
 * https://auth0.com/docs/customize/actions/triggers/post-user-registration/event-object
 */
exports.onExecutePostUserRegistration = async (event) => {
  await axios.post('https://${API_DOMAIN}/auth0/hooks/post-registration', {
    email: event.user.email,
  });
};
