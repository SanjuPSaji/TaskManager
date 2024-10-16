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

        stage('Run Image') {
            steps {
                script {
                    sh 'docker run -d -p 3000:3000 ${DOCKER_IMAGE}:frontend-latest'
                    // Capturing the container ID for later use
                    script {
                        CONTAINER_ID = sh(script: 'docker ps -q -f ancestor=${DOCKER_IMAGE}:frontend-latest', returnStdout: true).trim()
                    }
                }
            }
        }

        stage('Docker Stop') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_ID}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        echo 'Logged in to Docker Hub'
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
