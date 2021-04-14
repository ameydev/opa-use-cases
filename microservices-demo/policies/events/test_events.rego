package events


test_allow_default {
    allow = false
}

test_allow_get {
    allow with input as {"method": "POST" }
}

test_allow_all_to_admin {
    allow with input as {"role": "Admin", "method": "GET" }
    allow with input as {"role": "Admin", "method": "POST" }
    allow with input as {"role": "Admin", "method": "PUT" }
    allow with input as {"role": "Admin", "method": "DELETE" }
}
