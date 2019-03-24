
## Links

- https://kubernetes.io/docs/reference/kubectl/cheatsheet/#interacting-with-running-pods 
- https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#define-a-liveness-command
- https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
- https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.10/#_v1_container
- https://medium.com/bitnami-perspectives/imperative-declarative-and-a-few-kubectl-tricks-9d6deabdde

## Setup

- Setup
```
gcloud config set compute/zone us-east1
```

-  Create cluster
```
gcloud container clusters create textchart --num-nodes=1 --region us-east1
gcloud compute instances list
```

-  Start image
```
kubectl run textchart --image=plantuml/plantuml-server:jetty --port 8080
  or
kubectl create -f deployment.yml
```

- Create Load Balancer
```
kubectl expose deployment textchart --type=LoadBalancer --port 80 --target-port 8080
# Get IPs
kubectl get service textchart
```

- Pause
```
gcloud container clusters resize textchart --size=0 --region us-east1
```

- Delete
```
kubectl delete service textchart
```

- Info
```
kubectl get pods
kubectl get deployments
```

- Export configs
```
kubectl get deployments textchart --export -o yaml
```

- Update image
```
kubectl set image deployment/textchart textchart=plantuml/plantuml-server:jetty
```

- Scale up
```
kubectl scale deployment textchart --replicas=3
```

- Delete everything
``
kubectl delete service textchart
cloud container clusters delete textchart
```
