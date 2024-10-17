pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = "sanjupsaji/taskmanager"
        SONAR_AUTH_TOKEN = credentials('sonar-token')
        SCANNER_HOME = tool 'SonarQube Scanner'
        AZURE_CREDENTIALS_ID = 'azure-credentials'
        RESOURCE_GROUP = "Jenkins-server_group"
        AKS_CLUSTER_NAME = "taskmanageraks"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/SanjuPSaji/TaskManager'
                script {
                    COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        // Backend analysis
                        dir('backend') {
                            sh "${SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=TaskManager-backend \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=http://52.172.214.204:9000 \
                                -Dsonar.login=${SONAR_AUTH_TOKEN}"
                        }
                        // Frontend analysis
                        dir('frontend') {
                            sh "${SCANNER_HOME}/bin/sonar-scanner \
                                -Dsonar.projectKey=TaskManager-frontend \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=http://52.172.214.204:9000 \
                                -Dsonar.login=${SONAR_AUTH_TOKEN}"
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build both backend and frontend images
                    dir('backend') {
                        sh 'docker build --no-cache -t ${DOCKER_IMAGE}:backend-${COMMIT_HASH} .'
                    }
                    dir('frontend') {
                        sh 'docker build --no-cache -t ${DOCKER_IMAGE}:frontend-${COMMIT_HASH} .'
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        sh 'echo "Logged in to Docker Hub"'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        sh 'docker push ${DOCKER_IMAGE}:backend-${COMMIT_HASH}'
                        sh 'docker push ${DOCKER_IMAGE}:frontend-${COMMIT_HASH}'
                    }
                }
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([azureServicePrincipal(AZURE_CREDENTIALS_ID)]) {
                    script {
                        sh '''
                        az login --service-principal \
                        -u $AZURE_CLIENT_ID \
                        -p $AZURE_CLIENT_SECRET \
                        --tenant $AZURE_TENANT_ID
                        '''
                    }
                }
            }
        }

        stage('Get AKS Credentials') {
            steps {
                script {
                    // Get AKS credentials and set the context
                    sh '''
                    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME --overwrite-existing
                    '''
                }
            }
        }

        stage('Deploy to AKS') {
            steps {
                script {
                    echo "Deploying Docker images to AKS"
                    
                    // Replace the placeholder __IMAGE_TAG__ in deployment.yaml with the actual Docker image tags
                    sh """
                    sed -i 's|__IMAGE_TAG__|frontend-${COMMIT_HASH}|g' deployment.yaml
                    """
                    
                    // Apply the updated Kubernetes deployment and service YAML files
                    sh '''
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                    kubectl get services --namespace default
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                echo "Cleaning up Docker resources..."
                sh '''
                    docker container prune -f
                    docker image prune -a -f
                    docker volume prune -f
                    docker builder prune -f
                '''
            }
        }
    }
}
