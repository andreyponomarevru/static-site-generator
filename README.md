# About
Node.js static site generator built from scratch for personal website

# Features

* Takes Markdown and JSON-metadata files, combines them using JavaScript-template and outputs HTML files
* Imports projects metadata from your GitHub account 
* Uses SASS for styling

# Requirements

* Node.js
* Set your GitHub API token in `GITHUB` environment variable (in `/etc/environment` or `~/.bashrc`)
* Set GitHub repository owner name in `REPO_OWNER` environment variable (in `nodemon.json`)

# Structure

* `src/`
  * `dns/` - DNS settings
  * `favicon/`
  * `img/` - images used on index page and in markdown articles
  * `js/` - scripts
  * `md/` - markdown articles
  * `meta_index/projects.json` - metadata for portfolio projects ("Portfolio" section on index page)
  * `meta_md/` - metadata for markdown articles ("Articles" section on index page)
  * `sass/` - styles
* `build-scripts/`
  * `index/template.js` - index page template
  * `mardown/template.js` - markdown articles template
  * `githubAPIClient.js` - GitHub API client

# How to update the website

```shell
# 1. Build (the script builds the index page as well as all markdown articles pages)
npm run start

# 2. Push updated build files to https://github.com/ponomarevandrey/my-website, for example:
cd build
git init
git add --all && git commit -m "Update"
git push --set-upstream https://github.com/ponomarevandrey/my-website master --force
```

# How to change the domain name
1. Change the domain name in `/src/dns/CNAME` 
2. [Repository settings](https://github.com/ponomarevandrey/my-website/settings) > GitHub Pages > Custom Domain (add new domain)
