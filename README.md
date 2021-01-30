# About
Node.js static site generator built from scratch for personal website

# Structure

* `src/`
  * `dns/` - DNS settings
  * `favicon/`
  * `img/` - images used on index page and in markdown articles
  * `js/`
  * `md/` - markdown articles
  * `meta_index/projects.json` - metadata for portfolio projects ("Portfolio" section on index page)
  * `meta_md/` - metadata for markdown articles ("Articles" section on index page)
  * `sass/` - styles
* `build-scripts/`
  * `index/template.js` - index page template
  * `mardown/template.js` - markdown articles template

# How to update the website

```shell
# 1. Build index page 
npm run start

# 2. Build article pages 
npm run build-md

# 3. Push updated build files to https://github.com/ponomarevandrey/my-website, for example:
cd build
git init
git add --all && git commit -m "Update"
git push --set-upstream https://github.com/ponomarevandrey/my-website master --force
```

# How to change the domain name
1. Change the domain name in `/src/dns/CNAME` 
2. https://github.com/ponomarevandrey/my-website/settings > GitHub Pages > Custom Domain (add new domain)
