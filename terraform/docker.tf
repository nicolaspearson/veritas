resource "docker_image" "terraform-veritas" {
  name = "veritas:latest"
}

resource "docker_container" "terraform-veritas" {
  image = docker_image.terraform-veritas.latest
  name  = "terraform-veritas"
  ports {
    internal = 3000
    external = 3000
  }
  env = [
    "AUTH0_CLIENT_ID=${auth0_client.terraform-veritas.client_id}",
    "AUTH0_CLIENT_SECRET=${auth0_client.terraform-veritas.client_secret}",
    "AUTH0_CLIENT_DOMAIN=${var.auth0_domain}",
    "AUTH0_API_IDENTIFIER=${var.terraform-veritas-api-identifier}"
  ]
}
