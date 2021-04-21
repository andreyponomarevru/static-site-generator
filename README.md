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

# Internals

Some important dirs/files:

```
├── ssg
|   ├── build                      # compiled website files for uploading to GitHub Pages
|   └── src
|       ├── dns
|       │   └── CNAME              # DNS settings
|       ├── favicon
|       ├── img                    # images used in HTML pages
|       ├── js                     # scripts used in HTML pages
|       ├── pages
|       |   ├── articles
|       |   │   ├── md             # Markdown articles
|       |   │   ├── meta           # HTML metadata for each article
|       |   │   └── template.ts    # template for Markdown articles
|       |   ├── index
|       |   │   ├── about.md       # Text for "About" article on index page
|       |   │   ├── github-projects.ts # list of projects to retrieve from GitHub API and inject into a template
|       |   │   ├── index.json     # HTML metadata
|       |   │   └── template.ts    # template for index page
|       |   └── particles.ts       # reusable code snippets and JS functions that dynamically generate and inject HTML code
|       ├── sass
|       ├── utility
|       ├── build-helpers.ts
|       ├── build.ts               # function which bundles everything together
|       ├── error-handlers.ts
|       ├── github-api-client.ts
|       ├── index.ts
|       └── types.ts
└── update-website                 # Bash script for deploying/updating the website.
```

SSG consists of only two templates which are regular functions, returning plain HTML code:

- template for index page (`ssg/src/pages/index/template.ts`)
- template for pages compiled from Markdown files (`ssg/src/pages/articles/template`)

We take metadata from JSON files, articles' text from Markdown files, retrieve some additional data from GitHub API and finally inject all this into our templates. Then we write these templates to disk as HTML pages. Here is a more detailed explanation of the SSG build algorithm:

1. Check if the `build` directory exists. If not, create it.
2. Clean up the `build` dir from all the content left after the previous build
3. Copy all static assets (images, favicons, scripts, DNS config) from `src` dir to `build`
4. Compile SASS styles
5. Compile index page:
   1. Load HTML metadata from JSON
   2. Load Markdown article
   3. Pass the loaded HTML metadata and Markdown article to the page template (which is a function). The template returns HTML code.
   4. We take this code and write it to the HTML file
6. Compile Markdown article pages. The process is 100% the same, just instead of compiling a single page, we're looping over an array of articles.

Then we use a small Bash script that uploads all files contained in `build` dir to GitHub Pages.

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

  "test": "mocha --watch ./test/**/*.test.ts
                 --recursive
                 --require ts-node/register"
},
```

Here is a diagram of processes started by the `start` script:

```
              concurrently
           /                \
       nodemon          live-server
      /        \
    node       mocha
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

  - **`mocha` process**

    Unlike the `node` process above, `mocha` is a long-running process. It watches for changes in `test` dir and reruns all tests every time we edit and save the code. We need to set the `--watch` option, otherwise, the process will exit with `No test files found` error. We also need to require the TS compiler module (`--require ts-node/register`). Without it, Mocha process won't be able to run tests written in TypeScript.

- [`live-server`](https://github.com/tapio/live-server#readme) is a "little development server with live reload capability". It serves all files from `/build` dir at [http://127.0.0.01:8080](http://127.0.0.01:8080), so we can check our website in the browser as we change it. You can specify another port as `PORT` env var in `ssg.env`.

So, we have 4 running processes in our container: `nodemon`, `concurrently`, `mocha`, and `live-server`. Additionally, every code change triggers the 5th short-lived process - `node`, which runs TS compiler transpiling the code and then returning the transpiled code ​to `node` for execution

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
