# About
Node.js static site generator built from scratch for personal website

# Features

* Takes Markdown and JSON-metadata files, combines them using JavaScript-template and outputs HTML files
* Imports projects metadata (repository name, last commit date and commit message) from your GitHub account. You can also set in JSON-file from which branch to read this metadata
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
* `update-website` - Shell-script for updating the website

# How to update the website

1. **Build.**  The script builds the index page as well as all markdown articles pages.
   ```shell
   npm run start
   ```

2. **Push to GitHub** (run the script from the root dir). The script pushes all files from `build` dir to https://github.com/ponomarevandrey/my-website, replacing all repository content with 
   new files
   ```shell
   ./update-website
   ```

   


# How to change the domain name
1. Change the domain name in `/src/dns/CNAME` 
2. [Repository settings](https://github.com/ponomarevandrey/my-website/settings) > GitHub Pages > Custom Domain (add new domain)
