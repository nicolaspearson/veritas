# veritas

This is an `auth0` experimental project.

## Requirements

- [x] Username / password sign-in
- [x] User registration
- [x] Social connect sign-in
- [ ] User account linking
- [ ] SAML sign-in

### Username & Password

Traditional username and password authentication flow.

### Social Connect

Allow registration and sign-in via a `Social Network` platform, e.g. Google, Facebook, etc.

### SAML

Allow registration and sign-in via a configured SAML flow.

SAML sign-in requirements:

- SAML 2.0 standard, a generic solution that will cover more use cases and will help for specific
  SSO such as Google or Microsoft (Office / Active Directory).
- External identity provider integration (e.g. Okta, Auth0, etc.)

The implementation of SSO will allow users to create an account and log in to the console using the
identity provider they want configured for their organization. They also would like their own groups
of users to be reflected in internal roles and permissions.

- Create DB schema for organizations, users (members), and roles and permissions.

#### TODO

- Create various user flows
- Allow account linking when their are multiple accounts using the same email address.
- Determine what Auth0 can store, and how would we extend our Auth0 to access other Okta or Auth0
  instances of external companies. Can this be solved with OIDC?
- How tightly coupled should the solution be with Auth0?
