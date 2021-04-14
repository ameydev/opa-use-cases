# Dynamically Load Policies using REST

## Run OPA service

### Run as server with path
    `opa run -s  --set=decision_logs.console=true .`

### Publish the Rego Rule
    `curl -X POST --data-binary @events/events.rego http://localhost:8181/v1/policies/events/allow`

### Update the Policies with REST

    `curl -X PUT --data-binary @events/events.rego http://localhost:8181/v1/policies/events/allow`
