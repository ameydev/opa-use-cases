package events

default allow = false

allow = true {
  input.method == "GET"
}

allow = true {
  input.method = "POST"
  input.role = "Admin"
}

allow = true {
  input.method = "POST"
  input.role = "Amey"
}
