pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Add your DockerHub credentials in Jenkins
        GIT_CREDENTIALS = credentials('github-credentials') // Add your GitHub credentials in Jenkins
        DOCKER_IMAGE = "sanjupsaji/taskmanager"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/SanjuPSaji/TaskManager', credentialsId: 'github-credentials'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t $DOCKER_IMAGE:backend-latest .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t $DOCKER_IMAGE:frontend-latest .'
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
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        sh 'docker push $DOCKER_IMAGE:backend-latest'
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
