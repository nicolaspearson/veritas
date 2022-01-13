resource "auth0_client" "terraform-veritas" {
  name = "Terraform Veritas"
  description = "The Veritas SPA (Managed by Terraform)"
  app_type = "spa"
  token_endpoint_auth_method = "client_secret_basic"
  is_token_endpoint_ip_header_trusted = false
  callbacks = ["http://localhost:3000/callback"]
  allowed_logout_urls = ["http://localhost:3000"]
  oidc_conformant = true
  is_first_party  = true
  grant_types = ["authorization_code", "client_credentials", "implicit", "refresh_token"]
  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client" "terraform-veritas-m2m" {
  name = "Terraform Veritas M2M"
  description = "The Veritas Machine To Machine Application (Managed by Terraform)"
  app_type = "non_interactive"
  token_endpoint_auth_method = "client_secret_post"
  is_token_endpoint_ip_header_trusted = true
  oidc_conformant = true
  is_first_party  = true
  grant_types = ["client_credentials", "password"]
  jwt_configuration {
    alg = "RS256"
  }
}

resource "auth0_client_grant" "terraform-m2m-client-grant" {
  client_id = "${auth0_client.terraform-veritas-m2m.id}"
  audience = "https://${var.auth0_domain}/api/v2/"
  scope = [
    "read:client_grants",
    "create:client_grants",
    "delete:client_grants",
    "update:client_grants",
    "read:users",
    "update:users",
    "delete:users",
    "create:users",
    "read:users_app_metadata",
    "update:users_app_metadata",
    "delete:users_app_metadata",
    "create:users_app_metadata"
  ]
}

resource "auth0_connection" "terraform-veritas-db" {
  name = "terraform-veritas-db"
  is_domain_connection = true
  strategy = "auth0"
  options {
    password_policy        = "good"
    brute_force_protection = true
  }
  enabled_clients = [
    auth0_client.terraform-veritas.id,
    auth0_client.terraform-veritas-m2m.id,
    var.auth0_client_id
  ]
}

resource "auth0_connection" "terraform-veritas-google-oauth2" {
  name = "terraform-veritas-google-oauth2"
  strategy = "google-oauth2"
  options {
    scopes = [ "email", "profile" ]
    set_user_root_attributes = "on_each_login"
  }
  enabled_clients = [
    auth0_client.terraform-veritas.id,
    var.auth0_client_id
  ]
}
