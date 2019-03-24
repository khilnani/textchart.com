#!/usr/bin/env bash

# See: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cli-tutorial-ec2.html#ECS_CLI_tutorial_cluster_create
ecs-cli configure --cluster textchart --region us-east-1 --default-launch-type EC2 --config-name textchart

# See: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
ecs-cli up --instance-role AmazonEC2ContainerServiceforEC2Role --size 1 --instance-type t2.small --cluster-config textchart

ecs-cli compose up --cluster-config textchart
ecs-cli ps

## Create a LB in the EC2 dashboard manually
