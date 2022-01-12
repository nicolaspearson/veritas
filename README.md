# veritas

This is an `auth0` experimental project.

## Requirements

- [x] Username / password sign-in
- [x] User registration
- [x] Social connect sign-in
- [ ] User account linking
- [ ] SAML sign-in
- [ ] WS-Fed sign-in

## Flows

### Username & Password

Traditional username and password authentication flow.

#### Registration

> A user registers by providing a username and password:

- Does the user already exist in the database?

  - Yes: return a 201 (to avoid user enumeration attacks)
  - No: continue with the flow

- Is the user already registered in `auth0`?

  - Yes: retrieve the `auth0_id`, and continue with the flow
  - No: create the user in `auth0`, and continue with the flow

- Create the user record in the database with the `auth0_id`

  - Should we allow a user that is registered with a social connection in `auth0` to also register
    using a username and password, and then **link** the accounts?

- Return a 201 to the user. (The user should be redirected to a login page)

#### Login

> A user logs in by providing a username and password:

- Does the user exist in the database?

  - Yes: continue with the flow
  - No: return a 404 (to avoid user enumeration attacks): "Invalid username or password"

- User's credentials are correct in `auth0`?

  - Yes: continue with the flow (returns a JWT)
  - What action should we take if a user has registered with `google-oauth`?
  - No: return a 404 (to avoid user enumeration attacks): "Invalid username or password"

- Return a 200 to the user with the JWT.

```mermaid
sequenceDiagram
    actor User
    participant API
    User->>API: Submit credentials
    alt has registered
        API->>Auth0: Validate credentials
        alt is valid
            Auth0->>API: Return a JWT
            API->>User: Return a 200 with the JWT
        else is not valid
            Auth0->>API: Throws a 401
            API->>User: Return a 404
        end
    else is not registered
        API->>User: Return a 404
    end
```

### Social Connect

Allow registration and sign-in via a `Social Network` platform, e.g. Google, Facebook, etc.

> A user registers by selecting "Continue with Google" on the registration page:

The user is authenticated in the browser, subsequently the `auth0` actions are triggered:

> pre-registration

- Does the user have multiple `identities` in `auth0`:

  - Yes:
    - `metadata.link_identities = true`
  - No:
    - `metadata.link_identities = false`

- Does the user exist in the database:

  - Yes:
    - `metadata.create_user = false`
  - No:
    - `metadata.create_user = true`

- Can the `identities` be requested directly from `auth0` in the action?
- Is there a scenario where a user exists in the database but not in `auth0`?

> post-login

- `metadata.create_user = true`:

  - Create user in the database
    - Endpoint needs to be defined

- `metadata.link_identities = true`:

  - Link user identities from the API
    - Endpoint needs to be defined

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

- [ ] Auth [Middleware](https://www.npmjs.com/package/express-oauth2-jwt-bearer)
- [ ] Scope Middleware (See above) -> This should also be considered in the roles and permissions
- [ ] Terraform configuration

- Create various user flows
- Allow account linking when their are multiple accounts using the same email address.
- Determine what Auth0 can store, and how would we extend our Auth0 to access other Okta or Auth0
  instances of external companies. Can this be solved with OIDC?
- How tightly coupled should the solution be with Auth0?

- Configure Auth0 using terraform.

- Create admin panel using [Retool](https://retool.com/)

- What other flows are there?

- What is the database structure?

- How are the roles and permissions structured?
