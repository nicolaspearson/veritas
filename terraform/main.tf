resource "auth0_client" "terraform-veritas" {
  name            = "Terraform Veritas"
  description     = "App for running a Dockerized version of Veritas via Terraform"
  app_type        = "regular_web"
  callbacks       = ["http://localhost:3000/callback"]
  oidc_conformant = true
  is_first_party  = true
  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_connection" "terraform-veritas-db" {
  name     = "terraform-veritas-db"
  strategy = "auth0"
  options {
    password_policy        = "good"
    brute_force_protection = true
  }
  enabled_clients = [auth0_client.terraform-veritas.id, var.auth0_client_id]
}

resource "auth0_user" "terraform-veritas-admin-user" {
  connection_name = auth0_connection.terraform-veritas-db.name
  user_id         = "12345"
  email           = "admin@veritas.com"
  email_verified  = true
  password        = var.auth0_admin_user_password
  roles           = [auth0_role.terraform-veritas-admin-role.id]
}

resource "auth0_resource_server" "terraform-veritas-resource-server" {
  name                                            = "Terraform Auth0 Resource Server"
  identifier                                      = var.terraform-veritas-api-identifier
  skip_consent_for_verifiable_first_party_clients = true
  token_dialect                                   = "access_token_authz"
  enforce_policies                                = true

  scopes {
    value       = "create:note"
    description = "Only administrators can create notes"
  }

  scopes {
    value       = "read:note:self"
    description = "Read Own Notes"
  }

  scopes {
    value       = "read:note:all"
    description = "Administrators can read all notes"
  }
}

resource "auth0_role" "terraform-veritas-admin-role" {
  name        = "admin"
  description = "administrator"
  permissions {
    resource_server_identifier = auth0_resource_server.terraform-veritas-resource-server.identifier
    name                       = "create:note"
  }

  permissions {
    resource_server_identifier = auth0_resource_server.terraform-veritas-resource-server.identifier
    name                       = "read:note:all"
  }
}

resource "auth0_role" "terraform-veritas-basic-user-role" {
  name        = "basic_user"
  description = "Basic User"
  permissions {
    resource_server_identifier = auth0_resource_server.terraform-veritas-resource-server.identifier
    name                       = "read:note:self"
  }
}

resource "auth0_rule" "terraform-veritas-basic_user-rule" {
  name = "basic-user-role-assignment"
  script = templatefile("${path.module}/basic-user-rule.js", {
    TERRAFORM_ROLE_ID : auth0_role.terraform-veritas-basic-user-role.id
  })
  enabled = true
}
