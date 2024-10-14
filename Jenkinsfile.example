def configVar = ""

pipeline {
  environment {
    CONFIG_PATH = "${VAULT_ENDPOINT}/${ENVIRONMENT}"
    BUILD_FOLDER_NAME = "build"
    ENV_PATH = ".env"
  }
  
  agent {
    label "${AGENT}"
  }

  stages {
    stage('Preparing') {
      steps {
        git branch: "${GITHUB_RESOURCE}",
          credentialsId: "${GITHUB_ACCESS_ID}",
          url: "${GIT_URL}"
      }
    }

    stage('Get Config') {
      agent { 
        // use nonmacmini agent because macmini doesn't have VPN connection
        label 'nonmacmini' 
      }

      steps {
        script {
          withCredentials([string(
            credentialsId: "${VAULT_ACCESS_ID}", 
            variable: 'VAULT_TOKEN'
          )]) {
            try {
              def curlResponse = sh(
                script: 'curl --fail --location "$CONFIG_PATH" --header "X-Vault-Token: $VAULT_TOKEN"', 
                returnStdout: true
              )
              def resJSON = readJSON text: curlResponse
              def configData = resJSON.data.data

              configVar = configData.collect { key, value ->
                "${key}=${value}"
              }.join('\n')
            } catch (e) {
              error("Failed to get config data: ${e}")
            }
          }
        }
      }
    }

    stage('Build') {
      environment {
        HOME = "${env.WORKSPACE}"
      }

      steps {
        script {
          if(configVar == "") {
            error "Empty config value..."
          }

          sh "touch ${ENV_PATH}"
          writeFile file: ENV_PATH, text: configVar
        }

        nodejs(nodeJSInstallationName: 'node22.4.1') {
          sh 'npm cache clean --force'
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Test') {
      environment {
        HOME = "${env.WORKSPACE}"
      }
      steps {
        nodejs(nodeJSInstallationName: 'node22.4.1') {
          sh 'npm run test'
        }
      }
    }

    stage('Deploy') {
      steps {
        withAWS(credentials: "${AWS_ACCESS_KEY_ID}", region: "${AWS_REGION}") {
          s3Delete(bucket: "${AWS_BUCKET_NAME}", path: '/')
          s3Upload(bucket: "${AWS_BUCKET_NAME}", file: "${BUILD_FOLDER_NAME}")
          cfInvalidate(distribution: "${AWS_CLOUDFRONT_DISTRIBUTION_ID}", paths: ['/*'])
        }
      }
    }
  }

  post {
    success {
      deleteDir()
    }
    failure {
      deleteDir()
    }
  }
}