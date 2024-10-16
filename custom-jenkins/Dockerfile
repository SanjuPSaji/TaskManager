FROM jenkins/jenkins:lts

# Switch to root user to install Docker
USER root

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg2 \
                       software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce-cli

# Create the docker group and add Jenkins user to it
RUN groupadd -f docker && usermod -aG docker jenkins

# Switch back to the Jenkins user
USER jenkins
