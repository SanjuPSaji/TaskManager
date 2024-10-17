pipeline { 
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Add your DockerHub credentials in Jenkins
        DOCKER_IMAGE = "sanjupsaji/taskmanager"
    }

    stages {
        stage('Checkout') {
            steps {
                // Specify the branch if needed
                git branch: 'main', url: 'https://github.com/SanjuPSaji/TaskManager'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t ${DOCKER_IMAGE}:backend-latest .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t ${DOCKER_IMAGE}:frontend-latest .'
                    }
                }
            }
        }

        stage('Run Backend Image') {
            steps {
                script {
                    // Run the backend container
                    sh 'docker run -d -p 4000:4000 ${DOCKER_IMAGE}:backend-latest'
                    // Capturing the backend container ID for later use
                    script {
                        BACKEND_CONTAINER_ID = sh(script: 'docker ps -q -f ancestor=${DOCKER_IMAGE}:backend-latest', returnStdout: true).trim()
                    }
                }
            }
        }

        stage('Run Frontend Image') {
            steps {
                script {
                    // Run the frontend container
                    sh 'docker run -d -p 3000:3000 ${DOCKER_IMAGE}:frontend-latest'
                    // Capturing the frontend container ID for later use
                    script {
                        FRONTEND_CONTAINER_ID = sh(script: 'docker ps -q -f ancestor=${DOCKER_IMAGE}:frontend-latest', returnStdout: true).trim()
                    }
                }
            }
        }

        stage('Docker Stop') {
            steps {
                script {
                    // Stop the backend container
                    sh "docker stop ${BACKEND_CONTAINER_ID}"
                    // Stop the frontend container
                    sh "docker stop ${FRONTEND_CONTAINER_ID}"
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

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        sh 'docker push ${DOCKER_IMAGE}:backend-latest'
                        sh 'docker push ${DOCKER_IMAGE}:frontend-latest'
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
