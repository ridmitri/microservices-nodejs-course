#  Microservices with Node JS and React

[Course page](https://www.udemy.com/course/microservices-with-node-js-and-react/)

## Development 

- Run Kubernetes cluster inside Google Cloud or on Docker Desktop
- Use Ingress Inginx Controller to access the cluster
- Streamline development code updates using [Skaffold](https://skaffold.dev/)

## Switch between local K8s and GKE

For running the cluster n Docker Desktop:

1. Images in services must point to docker hub
2. Skaffold images must be set to docker hub
3. Set `build.local` to `push: false` in skaffold.yaml
4. Ingress service host must be set a domain pointing to 127.0.0.1 by tweaked hosts config

For running on GKE

1. Images must be set to `us.gcr.io/ticketings/`
2. Skaffold setting `googleCloudBuild` should be set to `projectId: ticketings` 
3. Ingress service host should be set to ticketings.gc

## Setup k8s cluster

1. [Setup Ingress controller](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
2. Add JWT secret in the cluster `kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf`

## Connect kubectl to GKE from local machine

1. Go to Kubernetes Engine page and select the cluster.
2. Press on >_Connect to open a cloud console.
3. Copy gcloud authorization command to local terminal. It will swtich local kubectl context to gcloud, e.g. `gcloud container clusters get-credentials ticketing-dev --zone europe-west3-a --project ticketings`.
4. Troubleshoot: Make sure gcloud is logged in.

## Setup a new service

1. Create a source folder
2. Build an image
3. Create a k8s deployment and service
4. Setup routing in the ingress service
5. Update skaffold config
