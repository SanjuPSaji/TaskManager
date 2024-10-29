# Task Manager CI/CD Pipeline

This project sets up a complete CI/CD pipeline using Jenkins, Docker, Azure Kubernetes Service (AKS), SonarQube, and Vercel. The pipeline automatically triggers on every commit to the GitHub repository and performs code analysis, builds Docker images, deploys to AKS, and triggers a deployment to Vercel.

![WhatsApp Image 2024-10-18 at 04 22 48_e9754af8](https://github.com/user-attachments/assets/68e7e283-9d60-4cff-a901-387485ca47a5)


## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── src
│   └── ...
├── frontend
│   ├── Dockerfile
│   ├── src
│   └── ...
├── deployment.yaml
├── service.yaml
├── Jenkinsfile
└── README.md
```

## Prerequisites

1. **Jenkins**: Installed and running.
2. **Docker**: Installed and configured.
3. **Azure CLI**: Installed and configured.
4. **GitHub Repository**: Set up with webhook to trigger Jenkins.
5. **SonarQube**: Set up and running.
6. **Vercel Account**: Set up and project created.

## Setup

### GitHub Webhook

1. Go to your GitHub repository settings.
2. Click on "Webhooks" and then "Add webhook".
3. Set the Payload URL to `http://your-jenkins-url/github-webhook/`.
4. Choose `application/json` as the content type.
5. Select "Just the push event".
6. Click "Add webhook".

### Jenkins Configuration

1. Install the necessary plugins: GitHub Integration Plugin, Docker Plugin, Kubernetes Plugin, etc.
2. Create a new Pipeline job and set it to use the `Jenkinsfile` from SCM.

### Jenkinsfile

The `Jenkinsfile` is already set up in the repository. It defines the following stages:

1. **Checkout**: Clones the repository and retrieves the commit hash.
2. **SonarQube Analysis**: Performs static code analysis for both backend and frontend.
3. **Build Docker Images**: Builds Docker images for backend and frontend.
4. **Docker Login**: Logs into Docker Hub.
5. **Push Docker Images**: Pushes the built images to Docker Hub.
6. **Azure Login**: Logs into Azure using service principal credentials.
7. **Get AKS Credentials**: Retrieves AKS credentials for deployment.
8. **Deploy to AKS**: Deploys Docker images to AKS.
9. **Deploy to Vercel**: Triggers a deployment to Vercel and checks the status.

### Environment Variables and Credentials

Ensure the following credentials and environment variables are set up in Jenkins:

- `dockerhub-credentials`: Docker Hub credentials.
- `sonar-token`: SonarQube authentication token.
- `azure-credentials`: Azure service principal credentials.
- `vercel-token`: Vercel authentication token.

### Kubernetes Deployment Files

The `deployment.yaml` and `service.yaml` files define the Kubernetes deployment and service configurations.

### Vercel Deployment Hook

Trigger the Vercel deployment using the provided deployment hook.

### Cleanup

The `post` section in the `Jenkinsfile` ensures cleanup of Docker resources after the pipeline execution.

## Usage

1. **Commit changes** to the GitHub repository.
2. The **Jenkins pipeline** will automatically trigger and execute all stages.
3. The project will be deployed to **AKS** and **Vercel**.
4. Monitor the build and deployment status on Jenkins.
