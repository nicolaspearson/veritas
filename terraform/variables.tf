variable "auth0_client_id" {
  description = "The client id of an API with access to the Auth0 Management API"
}

variable "auth0_client_secret" {
  description = "The client secret for the same API"
}

variable "auth0_domain" {
  description = "The auth0 domain"
}

variable "api_domain" {
  description = "The api domain"
  default = "localhost:3000"
}
