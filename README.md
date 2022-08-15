# About

Node.js static site generator built from scratch for personal website.

## Motivation

Although there are already tons of carefully built and polished static site generators, I decided to build another one. Why? The short answer — most if not all available SSGs are bloated with the stuff I don't need.

## Features

- compiles Markdown files to HTML using JS templates.

  Each template consists of "particles" — JS functions that return specific parts of the page, for instance, "menu", "projects", "articles", "favicons", ... Such modularization allows to reuse same code across multiple templates.

- imports repositories metadata in templates via GitHub API. Supported metadata:
  - repository description
  - commit metadata (last commit date, last commit message)
  - it is also possible to set the specific branch from which to retrieve commit metadata
- styling using SASS
- configuration using JSON files and Docker env vars
- includes Bash script deploying the website to GitHub Pages

# Requirements

* Docker Compose

# Building process

Although the coding part of the project was straightforward, I can't say the same about the building process - it ended up pretty convoluted so I want to explain (at least for my own self) what happens at each step

Take a look at the `scripts` property of `package.json`, this is the place where all the magic happens. When we start the Docker container, it triggers `npm run start` — let's explore what each command and option of the `start` script ​does.

> I've formatted JSON below to make all commands visually more distinguishable and clear

```json
"scripts": {
  "start": "concurrently --kill-others-on-fail
              \"nodemon --watch ./test
                        --watch ./src
                        --ext ts,scss,json,md
                        --exec
                            'TS_NODE_PROJECT=tsconfig.json
                             node --inspect=0.0.0.0:9229
                                  --require ts-node/register
                                  ./src/index.ts &&
                             npm run test'\"
              \"live-server --wait=500 ./build\"",
},
```

Here is a diagram of processes started by the `start` script:

```
              concurrently
           /                \
       nodemon          live-server
      /        
    node  
(TS compiler)
```

As you can see we're using `concurrently` to run `nodemon` and `live-server` at the same time.

- [`nodemon`](https://github.com/remy/nodemon) watches for changes in our files and also starts another two processes (using `--exec` option):

  - **`node` process** (TS compiler)

    ```json
    'TS_NODE_PROJECT=tsconfig.json node --inspect=0.0.0.0:9229
                                        --require ts-node/register ./src/index.ts &&
                                   npm run test'\"
    ```

    First, we pass to the `node` process the `TS_NODE_PROJECT` env var which contains the path to TS compiler config. We also set the debugger (`--inspect=0.0.0.0:9229`). And finally, we pass the `index.ts` to `node`.

    `node` requires TS compiler module (`-require ts-node/register`) and passes it `index.ts`. The compiler checks the config using env var (`TS_NODE_PROJECT`), transpiles TS to JS, and returns the index file to `node` for execution

# How to

## How to start the SSG

1. Set your GitHub API token, repository owner name, and other details as env vars in `ssg.env`.
2. `docker-compose up`
3. open [http://127.0.0.01:8080](http://127.0.0.01:8080)` in the browser
4. Now you can edit templates, Markdown files or any other kind of files and all changes will be immediately available in your browser

## How to deploy/update the website using GitHub Pages

1. Create a new GitHub repository for storing your website.
2. Start Docker container: `docker-compose up ssg`. Docker will create `build` folder on your disk as volume
3. Run `./update-website <your repo URL>`.
   For example `./update-website https://github.com/ponomarevandrey/my-website`. This Bash script pushes all files from your Docker's volume (`build` dir) to https://github.com/ponomarevandrey/my-website, replacing all repository content with new files.

## How to change the domain name

1. Change the domain name in `/src/dns/CNAME`
2. [Repository settings](https://github.com/ponomarevandrey/my-website/settings) > GitHub Pages > Custom Domain (add new domain)
