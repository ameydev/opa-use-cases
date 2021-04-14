package events

import data.events


# Allow "GET" request to all roles
allow {
  input.method = "GET"
}

allow = true {
  input.method = "POST"
  input.metadata.role = "Admin"
}

# # # Allow "PUT" request only to user who is presentor
# # #  https://play.openpolicyagent.org/p/No0lgeSvBa
allow {
  input.method = "PUT" 
  eventID = split(input.api, "/")[2]
  id = to_number(eventID)
  event = data.data.Events[_]
  event.ID = id
  input.metadata.user = event.Presentor
}

# allow {
#   input.method = "DELETE" 
#   eventID = split(input.api, "/")[2]
#   id = to_number(eventID)
#   event = data.data.Events[_]
#   event.ID = id
#   input.metadata.user = event.Presentor
# }

# # # Allow every request to Admin
allow {
  input.metadata.role = "Admin"
}
