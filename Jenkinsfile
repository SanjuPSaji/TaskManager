pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Add your DockerHub credentials in Jenkins
        DOCKER_IMAGE = "sanjupsaji/taskmanager"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/SanjuPSaji/TaskManager'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t backend-image .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t frontend-image .'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.test.yml up --abort-on-container-exit'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        sh 'docker tag backend-image:latest $DOCKER_IMAGE:backend-latest'
                        sh 'docker push $DOCKER_IMAGE:backend-latest'

                        sh 'docker tag frontend-image:latest $DOCKER_IMAGE:frontend-latest'
                        sh 'docker push $DOCKER_IMAGE:frontend-latest'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
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
