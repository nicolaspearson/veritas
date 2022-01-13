# Terraform

This guide provides steps for configuring terraform.

See this [reference](https://registry.terraform.io/providers/alexkappa/auth0/latest/docs/resources)
for documentation on the `auth0` terraform provider.

## Getting started

1. Create an `auth0` account
2. Navigate to the [Application Dashboard](https://manage.auth0.com/#/applications)
3. Click on "Create Application"
4. In the form that pops up, give your app a name like "Terraform Auth0 Provider" and select
   "Machine to Machine Application" as the type.
5. You'll need to authorize your new app to call the "Auth0 Management API". Select it in the
   dropdown and then authorize all scopes by clicking "All" in the top right of the scopes selection
   area. Click the "Authorize" button to continue.
6. You'll be taken to the details page for your new application. Open the "Settings" tab and copy
   the Client ID, Client Secret, and Domain values.
7. Create a new file named `terraform/deploy.tfvars` and fill in the Client ID, Client Secret, and
   Domain values from the previous step, e.g.:

   ```hcl
   auth0_client_id = "<YOUR_CLIENT_ID>"
   auth0_client_secret = "<YOUR_CLIENT_SECRET>"
   auth0_domain = "<YOUR_DOMAIN>"
   ```

8. Create the resources for the application:

   ```sh
   terraform init
   terraform apply -var-file="deploy.tfvars"
   ```

9. Make a copy of the `.env.example` file in the root directory, and name `.env`. Navigate back to
   the [Application Dashboard](https://manage.auth0.com/#/applications) and use the
   `Terraform Veritas` application to fill in the values below:

   ```sh
    AUTH0_CLIENT_ID=
    AUTH0_DOMAIN=
    AUTH0_SECRET=<ANY_LONG_RANDOM_STRING>
   ```

10. Navigate back to the [Application Dashboard](https://manage.auth0.com/#/applications) and use
    the `Terraform Veritas M2M` application to fill in the values below:

    ```sh
    AUTH0_M2M_CLIENT_ID=
    AUTH0_M2M_CLIENT_SECRET=
    ```

11. Set the "Default Directory" by navigating to the
    [Auth0 Dashboard](https://manage.auth0.com/dashboard) click on the dropdown in top left-hand
    corner, select "Settings", in the "API Authorization Settings" section set the
    "Default Directory" to `terraform-veritas-db`, and "Save" the changes.

If you would like to destroy the resources at any time use:

```sh
terraform destroy -var-file="deploy.tfvars"
```
