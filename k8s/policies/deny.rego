package kubernetes.admission

import data.kubernetes.namespaces


deny[msg] {
  input.request.kind.kind = "Pod"
  container = input.request.object.spec.containers[_]
  image = container.image
  parts := split(image, "/")
  not parts[0] = "gcr.io"
  msg := sprintf("Resource Pod/%v uses an image from of an unauthorised registry.", [input.request.object.metadata.name])
}

