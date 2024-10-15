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
                        bat 'docker build -t %DOCKER_IMAGE%:backend-latest .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        bat 'docker build -t %DOCKER_IMAGE%:frontend-latest .'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    bat 'docker-compose -f docker-compose.test.yml up --abort-on-container-exit'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        bat 'docker push %DOCKER_IMAGE%:backend-latest'
                        bat 'docker push %DOCKER_IMAGE%:frontend-latest'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    bat 'docker-compose down'
                    bat 'docker-compose up -d'
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
