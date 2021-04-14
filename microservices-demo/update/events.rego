package events


# Allow "GET" request to all roles
allow {
  input.method = "GET"
}

# Allow every request to Admin
allow {
  input.role = "Admin"
}
