#!/usr/bin/env sh

# abort on errors
set -e

# validate and build
npm run check

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git branch -M main
# if you are deploying to https://<USERNAME>.github.io
git push -f https://github.com/yuxuanz777/yuxuanz777.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -
