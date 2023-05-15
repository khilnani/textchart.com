
## Docker

- Uses docker image from - https://github.com/plantuml/plantuml-server

## Setup Overview

```
Web -SSL-> AWS API Gateway -> GCP Kubernetes [Docker Image]
```

## Setup Instructions

- See `aws-ecs.md`, `aws-eks.md,` or `google-kubernetes.md`
- Local `docker run -p 8080:8080 plantuml/plantuml-server:jetty`
