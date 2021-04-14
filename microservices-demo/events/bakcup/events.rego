default allow = false

allow {
  input.method == "GET"
}

allow = true {
  input.method = "POST"
  input.role = "Admin"
}

# allow = true {
#   input.method = "DELETE"
#   input.role = "Amey"
# }
