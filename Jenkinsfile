node {
    /*
     ** 需要修改的配置
    */
    def projectName = 'ProductOrderAdmin'
    def projectPath = env.WORKSPACE + '/' + projectName
    def codeGitPath = 'https://github.com/iHealthWeixin/ProductOrderAdmin.git'
    def codeGitBranch = 'master'
    def prdConfFile = 'prod.env.js'
    def FilePathPrd = projectPath + '/config/'
    def prdConfFilePath = '/Users/yinhd/Documents/serverConfig/' + projectName + '/' + prdConfFile
    def imageTag = 'hub.baidubce.com/imagehub-xxx-ajk/image-product-order-admin:3.0.' + env.BUILD_NUMBER
    def imageHub = 'code-env-xxx-test'
    def serviceName = 'test-product-order-admin'
    /*
     ** 需要修改的配置--结束
    */
    stage('PULL CODE'){
        if(!fileExists(projectPath)){
            echo 'project is exists'
            echo 'start clone'
            sh 'git clone ' + codeGitPath
            sh 'cd ' + projectName + ' && git checkout ' + codeGitBranch
        }else{
            echo 'project is not exists'
            sh 'cd ' + projectName + ' && git pull'
        }
        // if(fileExists(FilePathPrd + 'prod.env.js')){
        //     echo 'prd file is exists'
        //     sh 'rm ' + FilePathPrd + prdConfFile
        // }
        // echo 'copy prd file'
        // sh 'cp ' + prdConfFilePath + ' ' + FilePathPrd
    }
    stage('INSTALL'){
        echo 'The INSTALL stage'
        sh 'cd ' + projectName + ' && npm install'
    }
    stage('BUILD') {
        echo 'The BUILD stage'
        sh 'cd ' + projectName + ' && docker build -t ' + imageTag + ' .'
    }
    stage('PUSH') {
        echo 'The PUSH stage'
        sh 'docker push ' + imageTag
    }
    stage('PUBLISH') {
        echo 'The PUBLISH stage'
        sh 'kubectl -n ' + imageHub + ' set image deployment/' + serviceName + ' ' + serviceName + '=' + imageTag
    }
}