# terraform

This guide provides steps for configuring terraform.

## Getting started

1. Create an `auth0` account
2. Navigate to the [Application Dashboard](https://manage.auth0.com/#/applications)
3. Click on "Create Application"
4. In the form that pops up, give your app a name like "Terraform Auth0 Provider" and select
   "Machine to Machine Application" as the type.
5. You'll need to authorize your new app to call the "Auth0 Management API". Select it in the
   dropdown and then authorize all scopes by clicking "All" in the top right of the scopes selection
   area. Click the blue "Authorize" button to continue.
6. You'll be taken to the details page for your new application. Open the "Settings" tab and copy
   the Client ID, Client Secret, and Domain values.
7. Create a new file named `terraform/deploy.tfvars` and fill in the Client ID, Client Secret, and
   Domain values from the previous step, e.g.:

   ```hcl
   auth0_client_id = "<YOUR_CLIENT_ID>"
   auth0_client_secret = "<YOUR_CLIENT_SECRET>"
   auth0_domain = "<YOUR_DOMAIN>"
   ```

8. You can now create the resources for the application:

   ```sh
   terraform apply -var-file="deploy.tfvars"
   ```

> [Reference](https://registry.terraform.io/providers/alexkappa/auth0/latest/docs/resources/client)

## TODO

- [Create client resources](https://registry.terraform.io/providers/alexkappa/auth0/latest/docs/resources/client)
- [Create connection resources](https://registry.terraform.io/providers/alexkappa/auth0/latest/docs/resources/connection)
- Remove unused resources and configurations.
