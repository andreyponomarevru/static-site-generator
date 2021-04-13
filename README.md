- Try makr writeHTML sync function!

# About

Node.js static site generator built from scratch for personal website

# Features

- Takes Markdown and JSON-metadata files, combines them using JavaScript-template and outputs HTML files
- Imports projects metadata (repository name, last commit date and commit message) from your GitHub account. You can also set in JSON-file from which branch to read this metadata
- Uses SASS for styling

# Requirements

- Node.js
- Set your GitHub API token in `GITHUB` environment variable (in `/etc/environment` or `~/.bashrc`)
- Set GitHub repository owner name in `REPO_OWNER` environment variable (in `nodemon.json` and in `package.json` > `build` script)

# Structure

Important files:

- `src/`
  - `dns/` - DNS settings
  - `favicon/`
  - `img/` - images used on index page and in markdown articles
  - `js/` - scripts
  - `md/` - markdown articles
  - `meta_index/projects.json` - metadata for portfolio projects ("Portfolio" section on index page)
  - `meta_md/` - metadata for markdown articles ("Articles" section on index page)
  - `sass/` - styles
- `build-scripts/`
  - `index/template.js` - index page template
  - `mardown/template.js` - markdown articles template
- `utility/`
  - `githubAPIClient.js` - GitHub API client
- `update-website` - Shell-script for updating the website

`package.json` contains `start` script that starts the dev server:

```
// package.json
  ...
  "start": "concurrently --kill-others
              \"nodemon --watch ./src -e ts,json --exec TS_NODE_PROJECT=tsconfig.json node --inspect=0.0.0.0:9229 -r ts-node/register ./src/index.ts\"
              \"live-server ./build\"",
  ...
```

What it does is basically starts two scripts concurrently (with the help of the package of the same name, `concurrently`):

1. [`nodemon`](https://github.com/remy/nodemon)

- watches for changes in `ts`, `scss` and `json` files
- compiles TypeScript to JavaScript

2. [`live-server`](https://github.com/tapio/live-server#readme) provides us with the live dev server. It serves static files, so we can view our website in browser as we change it. The server runs at `http://127.0.0.01:8080`. You can specify another port as env var in `ssg.env`

- To add scripts and css files to `index` page, edit `src/templates/index.ts`
- To add scripts and css files to articles (pages generated from Markdown), edit `src/meta_md`

# How to start

1. `docker-compose up ssg`
2. open `http://127.0.0.01:8080` in your browser

# How to update website

1. `npm run build` - the script builds the index page as well as all markdown articles pages.
2. `./update-website` - push to GitHub (run the script from the root dir). The script pushes all files from `build` dir to https://github.com/ponomarevandrey/my-website, replacing all repository content with new files

# How to change the domain name

1. Change the domain name in `/src/dns/CNAME`
2. [Repository settings](https://github.com/ponomarevandrey/my-website/settings) > GitHub Pages > Custom Domain (add new domain)
