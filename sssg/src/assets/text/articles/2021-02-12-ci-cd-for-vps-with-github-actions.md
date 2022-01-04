# CI/CD for VPS with Docker Compose and GitHub Actions

0. [Overview](#overview)
1. [Prerequisites](#prerequisites)
   1. [What you need to do](#what-you-need-to-do)
   2. [What you need to know](#what-you-need-to-know)
2. [Manual Deployment](#manual-deployment)
   1. [Deployment](#deployment)
   2. [Updating code](#updating-code)
3. [Automated Deployment (setting up CI/CD pipeline with GitHub Actions)](#automated-deployment-setting-up-cicd-pipeline-with-github-actions)
   1. [Workflow file](#workflow-file)
      1. [Setting up environment variables for GitHub repo](#setting-up-environment-variables-for-github-repo)
      2. [Connecting Docker Hub repo to GitHub repo](#connecting-docker-hub-repo-to-github-repo)
4. [References](#references)
5. [Further Reading](#further-reading)

---

Every time we push new code to GitHub, we want to run tests, update Docker image, and deploy the app to VPS, running it with Docker Compose. At first glance, the process is pretty straightforward, but as it usually happens, when you integrate many seemingly simple things with each other, the complexity skyrockets. Thus, before automating the deployment, let's make sure we have a clear understanding of how to do everything manually (not only to see how tedious it is but also to better understand what steps we'll be automating). After that, we will automate the deployment by creating CI/CD pipeline with GitHub Actions.

**Also, note that this article *does not provide the actual Workflow file for setting up CI/CP pipeline*. I'll show an example of how this file might look like, but you shouldn't use this config for a real-life project. It's here just for reference.**



## Overview <a name="overview"></a>

I write this article based on my [Demo Deployment Project](https://github.com/ponomarevtest/node-docker-deploy) (it is a tiny containerized TypeScript app).

Here's the file structure of the project:
```
node-docker-deploy
├── docker-compose.dev.yml # for dev environment
├── docker-compose.yml     # for prod environment
├── .github
│   └── workflows
│       └── main.yml
├── .gitignore
├── LICENSE
├── node
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── .dockerignore
│   ├── .env               # stored only locally, not pushed to GitHub
│   ├── .eslintrc
│   ├── jest.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .prettierrc.js
│   ├── src
│   │   ├── index.ts
│   │   └── routes
│   ├── _test_
│   │   └── test.spec.ts
│   └── tsconfig.json
├── package-lock.json
└── README.md
```
To keep things simple, I created Docker config files for only two types of environment: 

* **development** — to run the project locally, issue `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`
* **production** — to run the project locally, issue `docker-compose -f docker-compose.yml up`

---

The manual deployment process doesn't require even having your project on GitHub. Everything you need is a) to have the app's code on your local machine, b) free Docker Hub account, and c) VPS.

**The algorithm for the manual deployment is as follows:**

1. Build container's production image using `Dockerfile.prod`.
2. Upload this image to Docker Hub.
3. Copy the production version of the `docker-compose.yml` file from the local machine (or from the project's GitHub repo)  to VPS. After that, just run `docker-compose up` (it will use this yml file by default), and that's it, your app is up and running.

   Note that the most important part happens in the aforementioned `docker-compose.yml`: it should contain the instructions to *pull the image from Docker Hub* (the one we've uploaded at step 2). So when you execute `docker-compose up`, Docker Compose pulls the app image from Docker Hub to your VPS's hard disk and starts the container from this image.

**The algorithm to manually update production container(s) is as follows:**

1. (similar to above) rebuild container's production image using `Dockerfile.prod`.
2. (similar to above) upload this updated image to Docker Hub.
   
   Pay attention: keep the image name the same, otherwise `docker-compose.yml` on VPS will pull the old image instead of the updated one.
3. on VPS, recreate the container from the updated image: restart the Docker Compose, telling him to use the updated version of the image: 
   ```shell
   docker-compose up -d --no-deps node # 'node' is our service name
   ```
   `-d` flag is for the 'detached mode', you can omit it.
   
   `--no-deps` flag prevents Compose from also recreating any services on which the `node` service depends.



## Prerequisites <a name="prerequisites"></a>

### What you need to do <a name="what-you-need-to-do"></a>

* The project repo contains all files mentioned in the article, except the environment variables file `.env`. Create it manually in `/node-docker-deploy/node/`. It should have the following content:
  ```env
  PORT=8080
  NAME=Andrey
  NODE_ENV=production
  ```
  **It's important to set the `NODE_ENV` to `production`** as [Express.js does some optimization specifically for production environemnt](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production).

* If you don't have it already, create [Docker Hub](https://hub.docker.com/) account. Docker Hub Container Image Library is the place where we will upload to and store our Docker Image(s). It's free and doesn't have any disk space limitations. Alternatively, we can use GitHub Container Registry or any other service.

* (Optional) Add your Docker Hub password to `deployment-scripts/docker-hub-password.txt`. This file is used only by the first-time deployment automation script `deployment-scripts/deploy.sh` to log in to Docker Hub. If you prefer to do everything manually, you can skip this. 

  Navigate to the `deployment-scripts` directory and execute:
  ```shell
  touch docker-hub-password.txt
  echo your_docker_hub_password > docker-hub-password.txt
  ```


### What you need to know <a name="what-you-need-to-know"></a> 

Let's discuss some stuff that we need to have a good grasp on before moving further.

* First: learn how GitHub Actions work, ([here's a good article](https://zellwk.com/blog/understanding-github-actions/)). Without understanding these basics, don't proceed further.

* Second: when you're setting up CI/CD, you need to use `npm ci` (instead of `npm install` that you use during development) both in GitHub Actions Workflow `.yml` file and in your production `Dockerfile`.

  *Text from [this Stackoverflow answer](https://stackoverflow.com/a/44297998/13156302):*
  
  `package-lock.json` *guarantees the exact same version of every package*. This file is automatically generated for any operations where npm modifies either the `node_modules` tree or `package. json`. This file stores an exact, versioned dependency tree rather than using starred versioning like `package.json` itself (e.g. `1.0.*`). This means you can guarantee the dependencies for other developers or prod releases, etc. It also has a mechanism to lock the tree but generally will regenerate if `package.json` changes.
   
  `npm install` will re-generate the `package-lock.json` file.
  
  *When on build server or deployment server, do `npm ci`* which will read from the `package-lock.json` file and install the whole package tree.

  So, `npm ci` will delete any existing `node_modules` folder and relies on the `package-lock.json` file to install the specific version of each package. It is significantly faster than `npm install` because it skips some features. Its clean state install is great for CI/CD pipelines and Docker builds! You also use it to install everything all at once and not specific packages.

  *Another explanation:*
  
  * use `npm install` to add new dependencies, and to update dependencies on a project. Usually, you would use it during development after pulling changes that update the list of dependencies but it may be a good idea to use `npm ci` in this case.

  * use `npm ci` if you need a deterministic, repeatable build. For example during continuous integration, automated jobs, etc. and when installing dependencies for the first time, instead of `npm install`.

  For more details refer to [`npm ci` vs. `npm install` — Which Should You Use in Your Node.js Projects?](https://betterprogramming.pub/npm-ci-vs-npm-install-which-should-you-use-in-your-node-js-projects-51e07cb71e26)


## Manual Deployment <a name="manual-deployment"></a>

### Deployment <a name="deployment"></a>

So, you have a project on your local machine. You want to deploy it and make it available to the world. Let's do it.

0. **Run all required tests**

1. **Build production image**. `cd` into the `node` directory and build the image. You can build it either with Docker or with Docker Compose:
   ```shell
   # Build with Docker
   docker build \
    -f Dockerfile.prod .
    -t ponomarevandrey/node-docker-deploy:latest
   ```
   `-t` flag is for tagging (naming) the image while you're building it.
   
   ```shell
   # Build with Docker Compose (preferred)
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```
   Note that we haven't specified the tag (`-t`) for the image of each service. We should do that in our docker-compose files as explained [here](https://stackoverflow.com/a/37574953/13156302).
   
   When running the prod containers (`docker-compose up ...`), you may encounter `ERROR: could not find an available, non-overlapping IPv4  address pool among the defaults to assign to the network` error, in that case just issue `docker network prune` to delete orphaned networks.
   
   **FYI. How to rename (= retag) the image:** after the above command, the default name of your image is `node-docker-deploy:latest`. You can rename it to whatever you want wiht `docker tag node-docker-deploy:latest myimage:sometag`.
   
   The entire name (`ponomarevandrey/node-docker-deploy:latest`) should match the image name in your production `docker-compose.yml`, let's verify this:
   ```dockerfile
   # ...
   
   services:
     node:
       container_name: node
       #         your Docker Hub repo name (it matches the account username)
       #       ______|_______
       #      |              |
       image: ponomarevandrey/node-docker-deploy
       #                     |__________________|
       #                              | 
       #              name of the image you uploaded to Docker Hub; 
       # It's OK to omit ":latest" here, because it is implied by default
       restart: always
   
   # ...
   ```
2. **Authenticate to Docker Hub**: `docker login` (pass your Docker Hub username and password)

3. **Push this image to Docker Hub** 
   ```shell
   docker push ponomarevandrey/node-docker-deploy:latest
   ```
   Here, `ponomarevandrey` is my Docker Hub account name

4. **SSH into your VPS and navigate to user home directory** (`/home/your-username`; I usually store my projects in this directory, but it's just a personal preference).

5. When you're in `/home/your-username`, **recreate the project structure required by the production version of `docker-compose.yml`** 
   ```shell
   # you can name these directories however you want, only the `node` 
   # directory should be named `node` because it is mentioned in 
   # `docker-compose.yml`.
   mkdir -p /home/your-username/node-docker-deploy/node 
   ```
6. **Copy the `.env` file from the local machine to the `node` directory**. It should contain the variables shown above in the "Prerequisites" > "What you need to do" section.

   Let's copy this file over SSH with `rsync`. On your local machine's terminal issue:
   ```shell
   rsync \
     --progress \
     --verbose \
     --archive \
     --rsh=ssh \
     ./node/.env your-username@xx.xxx.xxx.xxx:/home/your-username/node-docker-deploy/node/
   ```

7. Now back to VPS's terminal. **Copy the production version of `docker-compose.yml` to VPS**. 

   There are two ways to do this: either copy it from the GitHub repo (using `wget`) or from your local machine (using `rsync` as we've already done with `.env` file above)
   ```shell
   # Download the file from the project's GitHub repo:
   cd /home/your-username/node-docker-deploy/
   wget https://raw.githubusercontent.com/ponomarevtest/node-docker-deploy/main/docker-compose.yml
   
   # OR
   
   # Copy the file from your local machine.
   # To do this, switch back to local terminal and run (assuming you're in the
   # project's root dir):
   rsync \
     --progress \
     --verbose \
     --archive \
     --rsh=ssh \
     ./docker-compose.yml your-username@xx.xxx.xxx.xxx:/home/your-username/node-docker-deploy/
   ```

8. **Finally, start the app** 
   ```shell
   docker-compose up --build
   ```
   This command with use the production `docker-compose.yml` config file and perform the following steps:
   1. Pull image from Docker Hub (line `image: ponomarevandrey/node-docker-deploy` in `docker-compose.yml`) and build it
   2. Start the container using this image

I created Bash scripts automating all things described in this section and in "Updating code" section below:  [`deployment-scripts`](https://github.com/ponomarevtest/node-docker-deploy/tree/main/deployment-scripts) — instead of manually typing all commands, just use these scripts.



### Updating code <a name="updating-code"></a>

Now, suppose you've made some code changes, and you want to update your container. This requires us to partially repeat the steps above.

0. **Repeat steps 0-3 (i.e. rebuild the image and push it to Docker Hub)**

1. **Pull the updated image from Docker Hub and restart the container using this updated image**:
   
   1. **SSH into your VPS** and `cd` into `/home/your-username/node-docker-deploy` 
  
   2. **Pull new image**
      ```shell 
      docker-compose pull
      
      # OR from any directory:
      
      docker-compose -f /path/to/compose/file/docker-compose.yml pull
      
      # In my case I usually issue this (pull only 'api' service image):
      docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull api
      ```
   3. **Restart the container**. If you need to restart only the containers whose image was updated (as we usually do) add the `--no-deps` flag. 
   
      Also, note that in this command we build the image with Docker Compose instead of Docker; you can use Docker but it's just simpler to do this in a single command with Compose. 
      ```shell
      docker-compose \
        -f docker-compose.yml \
        -f docker-compose.prod.yml \
        up
          --force-recreate \
          --build 
          # + optional `--no-deps` and `-d`
      ```
      * Without `--force-recreate` Compose will use the old image
      * Without `-d` flag Compose will run in "attached mode" outputting everything to console. 
        
        By default, Docker runs the container in attached mode. In the attached mode, Docker can start the process in the container and attach the console to the process’s standard input, standard output, and standard error ([source](https://www.java4coding.com/contents/docker/docker-attached-vs-detached-mode))
        
        So later when we will be automating the deployment with GitHub Actions, always use `-d` everywhere to detach the terminal from Compose process stdout/stderr. When we write any deployment Bash scripts we should use the '-d' flag as well.

   4. **Delete old image(s)** to free up the disk space.
      ```shell 
      docker image prune -f
      ```
      Without the `-f` flag, Compose will ask us to confirm the command.
      
      This will restart only those containers whose image was updated (as we've rebuilt the image, our container's image *is* updated, hence the command restarts the container).

---

As you can see by now, manual deployment is extremely tedious. Luckily, we have a tool to automate it: GitHub Actions. There are actually other apps and services for this stuff, but GitHub Actions is probably the simplest one and it is free, so currently it's our best option.



## Automated Deployment (setting up CI/CD pipeline with GitHub Actions) <a name="automated-deployment-setting-up-cicd-pipeline-with-github-actions"></a>

Now imagine that we're starting our deployment again, from scratch. All we have is some freshly installed Ubuntu.

This time let's automate the whole process.

1. **First, repeat all steps of the manual deployment process.**

2. **Create the Workflow file.**

   Currently each time we want to update the app, we need to repeat most of the steps of the manual deployment process. To automate this part, we will use GitHub Actions. GitHub Actions require a special file known as Workflow file (sometimes referred to as "Action file"). This file describes all things we want to execute each time we `push` new code to the GitHub repo. We can create it manually or generate automatically on the GitHub website:

   * **how to create Workflow file manually** (preferred)
     1. On your local machine, navigate to the root directory of the project
     2. Create directories for the Workflow file
        ```shell
        mkdir -p .github/workflows
        ```
     3. Finally, create the file. Name it however you want, for example, `main.yml`:
        ```shell
        touch ./.github/workflows/main.yml
        ```
        
     The only downside of creating the Workflow file manually is that there won't be any default template code in it. So, this is just a convenience thing. Don't worry, in the next section, I will show the most basic Workflow file code if you want to create it manually from scratch.

   * **how to auto-generate Workflow file on GitHub website**. If you want just to play with GitHub Actions to get the basic idea of how things work, use the following simpler approach.
   
     1. Go to the "Actions" tab of your repo. The opened page presents various *workflow* templates.
     2. Scroll down, looking for a workflow template called `Simple workflow` — this is the simplest possible workflow template; click "Set up this workflow". 
     3. The new workflow template will open — it will be the `yml` file containing some very basic code. You can edit the name of this file at the top of the page. Suppose we will name the file `main.yml`. 
     4. Next at the top right corner click "Commit". This will create `.github/workflows/my-action.yml` in the root of your repository. 
     5. Now go to the "Actions" tab of your repo and look at what happens: GitHub runner will start, execute all jobs in all Workflows files and display errors or successful results.
      
   The Workflow file is the heart of your CI/CD pipeline; put in it everything you want to automate i.e. to do on every `push` to a repository (or on some another action). In our case, it essentially will execute all commands we've been executing in "Doing everything manually" > "Redeployment" on every `push` to the repository.
   
   **GLOSSARY**. GitHub uses the terms "action" and "workflow" interchangeably depending on the context, but they essentially refer to the same thing, AFAIU. It introduces a lot of confusion and I haven't figured out everything about these terms yet, maybe I've misunderstood something. For more clarification on terminology, refer to GitHub Actions documentation.

3. **Commit and push the Workflow file to GitHub repo.**
   ```shell
   git add ./.github/workflows/main.yml
   git commit -m "Add workflow"
   git push
   ```
4. Now, **open the GitHub repo in your browser and go to the "Actions" tab.**

   You will see your Workflow file — GitHub runner either has it already executed or will execute it after some short delay (sometimes it takes time for the runner to start processing the file, that's normal). Eventually, your Workflow file will be either processed successfully, or you will see errors.

If you don't understand something (especially GitHub Actions terminology, which sometimes is really inconsistent and confusing), consult the [An Introduction to Github Actions]((https://gabrieltanner.org/blog/an-introduction-to-github-actions)) article. Its author gives an awful explanation of how things work, BUT sections explaining basic terminology at the very beginning of the article, are excellent.



### Workflow file <a name="workflow-file"></a>

The Workflow file is the most important one of the entire project and basically represents the CI/CD pipeline itself.

**NOTE**. [Documentation for Workflow file syntax](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions). But better, just go through the [Understanding how to use Github Actions](https://zellwk.com/blog/understanding-github-actions/) article — it explains each declaration in the Workflow file in a clearer way.

Below is the simplest possible variant of the Workflow file. 

Everything it does is `echo`ing "Hello world" on GitHub runner every time you `push` to the repo.

```yml
name: MyTestGitHubAction
on: [ push ]
jobs:
  write-to-console:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello world!"
```

Let's examine [the Workflow file of our Demo Project](`https://github.com/ponomarevtest/node-docker-deploy/blob/main/.github/workflows/main.yml`).

There are three jobs in our Workflow: 

1. `build_test` — run unit tests for the `node` service (i.e. our app); I say "service" because normally we run it as a Docker container, but here we want just to execute tests, so we don't use Docker. Instead, we just install all project's dependencies and run the test script in `package.json`. 

2. `push_to_docker_hub` — in this job, GitHub runner builds the production version of `node` service Docker image > uploads it to Docker Hub repository > spins up the container to verify that everything works as intended. 

   This Docker Hub repo is meant to be used for storing images you later want to deploy to your VPS. 

3. `deploy` — SSH into VPS and start Docker Compose. It will pull the image we've just uploaded to Docker Hub (in the second job, above) and start the image as a container with our app.

**GLOSSARY**. The first and second steps are part of "continuous integration". In our project "continuous integration" means running code tests and/or any other tasks on every `push` or other events. 

The third step is "continuous delivery/deployment". In our project, "continuous deployment" means the deployment of an image from the Docker Hub repository to our VPS and running it. Continuous Deployment can be implemented either using GitHub Actions (as we do it in this project) or some other app or service if GitHub Actions features do not suffice.



#### Setting up environment variables for GitHub repo <a name="setting-up-environment-variables-for-github-repo"></a>

In the Workflow file, we first test and then build an image. After that, we need to upload it to the Docker Hub repository for future use (i.e. to deploy to VPS). To do this, GitHub Actions needs somehow to connect to our Docker Hub repository — this task requires the username and password of our Docker Hub account — note the `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` env vars used in the Workflow file:

```yml
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
```
 
* `DOCKERHUB_USERNAME` is our Docker Hub account username
* `DOCKERHUB_TOKEN` is the token obtained at [Docker Hub website](https://hub.docker.com):
  1. in the Docker Hub admin panel, go to the "Account Settings"
  2. [click "Security" tab](https://hub.docker.com/settings/security)
  3. click the "New Access Token" button
  4. enter the token name (any name is fine, it won't be used anywhere in the project)

  Now you can use this token for `DOCKERHUB_TOKEN` env var in the Workflow file.

As you should know by now (after reading GitHub Actions documentation or tutorials), all code in the Workflow file runs on GitHub Server called *runner*, which is a Linux virtual machine. GitHub takes your repo's files and puts them to the Linux virtual server (aka runner), and then starts executing commands defined in the Workflow file on this virtual server. 

Thus, environment variables mentioned in the Workflow file are just env vars provided to a runner's environment — Linux OS. So we need to somehow set env vars for the Linux environment in which the runner executes our code:

1. open your GitHub repository
2. navigate to the "Settings" tab
3. go to the "Secrets" tab 
4. click the "New repository secret" to add new env vars — conventionally their names are written as capitals with an underscore in place of space. Name the variable `DOCKERHUB_USERNAME` and set its value to your Docker Hub account's username 
5. create another env var called `DOCKERHUB_TOKEN` with the Access Token obtained at Docker Hub as I've already explained above. 
  
Now, when GitHub will be processing your Workflow file, the runner (i.e. Linux virtual machine) will "see" these env vars and substitute them with their values. 
   
To use the env vars in the Workflow file, you need to refer to them as `secrets.ENV_VAR_NAME`.

[Our Workflow file](https://github.com/ponomarevtest/node-docker-deploy/blob/main/.github/workflows/main.yml) requires the following env vars to be set up on GitHub (`https://github.com/<username>/<project-name/settings/secrets/actions`):

* `DOCKERHUB_TOKEN`
* `DOCKERHUB_USERNAME`
* `VPS_SSH_HOST`
* `VPS_SSH_PORT`
* `VPS_SSH_SECRET` (this is SSH key you use to SHH into your VPS; just copy it from the local machine to GitHub as any other env var)
* `VPS_SSH_USERNAME`



#### Connecting Docker Hub repo to GitHub repo <a name="connecting-docker-hub-repo-to-github-repo"></a>

Next, you need to connect Docker Hub and your GitHub repository: 

1. Log into your Docker Hub account and in the admin panel click ["Repositories"](https://hub.docker.com/repositories) (at the very very top menu) 
2. Click the "Create Repository" button
3. Leave all settings intact and *name the repo with the same name as your GitHub repo* (just to be consistent) — you will use this name (Docker Hub repo name) in the Workflow file. 

   For instance, take a look at [this project's Workflow file](https://github.com/ponomarevtest/node-docker-deploy/blob/main/.github/workflows/main.yml): there is a line `${{ secrets.DOCKERHUB_USERNAME }}/node-docker-deploy:latest` and similar lines in some other places — `node-docker-deploy` part of the line is your Docker Hub repository name.

Now you can refer to this Docker Hub repository in the Workflow file.



## References <a name="references"></a>

GitHub Actions Workflow file examples:
* [DigitalOcean Docker Swarm Deploy Workflow](https://gist.github.com/Aldo111/702f1146fb88f2c14f7b5955bec3d101)

Articles:
* [Express.js. Production best practices: performance and reliability](https://expressjs.com/en/advanced/best-practice-performance.html)
* [GitHub Actions Doc: Understanding the workflow file](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#understanding-the-workflow-file)
* [GitHub Actions Deploy on VPS](https://zellwk.com/blog/github-actions-deploy/)
* [Deploy your NodeJS App to a server with Docker](https://dev.to/arnu515/deploy-your-nodejs-app-to-a-server-with-docker-1hcd)
* [Dockerizing a React App](https://mherman.org/blog/dockerizing-a-react-app/)
* [Using Docker for Node.js in Development and Production](https://dev.to/alex_barashkov/using-docker-for-nodejs-in-development-and-production-3cgp)
* [Stackoverflow: Deploy Docker Container with Compose & Github Actions](https://stackoverflow.com/questions/67023441/deploy-docker-container-with-compose-github-actions)
* [Docker Doc: Repositories](https://docs.docker.com/docker-hub/repos/)

   
   
## Further Reading <a name="further-reading"></a>

* [10 best practices to containerize Node.js web applications with Docker](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/)
