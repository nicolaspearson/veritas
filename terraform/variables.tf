

variable "auth0_domain" {
  description = "The auth0 domain"
}

variable "auth0_client_id" {
  description = "Client_id of an API with access to the Auth0 Management API"
}

variable "auth0_client_secret" {
  description = "The secret for the same API"
}

variable "auth0_admin_user_password" {
  description = "The password of the admin user"
  default = "!Test1234!"
}

variable "terraform-veritas-api-identifier" {
  type    = string
  default = "https://terraform-veritas-resource-server"
}
