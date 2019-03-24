#!/usr/bin/env bash

# Based on https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app

# Setup
gcloud config set compute/zone us-east1

## Create cluster
gcloud container clusters create textchart --num-nodes=1
gcloud compute instances list

## Start image
kubectl run textchart --image=plantuml/plantuml-server:jetty --port 8080
kubectl get pods

## Load Balance
kubectl expose deployment textchart --type=LoadBalancer --port 80 --target-port 8080
kubectl get service textchart

# kubectl delete service textchart
# kubectl expose deployment textchart --type=LoadBalancer --port 443 --target-port 8080


## Update image
kubectl set image deployment/textchart textchart=plantuml/plantuml-server:jetty

## List and delete a pod
# kubectl get pods
# kubectl delete pod ID

## Scale up
# kubectl scale deployment textchart --replicas=3
# kubectl get deployment textchart
# kubectl get pods textchart

## Delete
# kubectl delete service textchart
# cloud container clusters delete textchart
