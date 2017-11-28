# ASDFAS

## Setup

Make sure to run `npm install` after downloading. 

Use command `npm start` to start a development server.

Install the current python version, and then run "pip install beautifulsoup4" if you are on windows. Linux--use your package manager to install "beautifulsoup4," if applicable.

## Commands

- `npm run start` starts the server
- `npm run sass` compiles sass code
- `npm run pack` compiles javascript code

## Contributing

To contribute, check out a new branch in your local repository using `git checkout -b [branch-name]`. Make all of your changes in this branch.

You should commit frequently. When you are ready to merge your work, check out many commits you have made. Then, squash your commits into one using the command `git rebase -i HEAD~[number of commits]`, where 'number of commits' is the number of commits you've made on your current branch; for example, if you make two commits, you would use `git commit -i HEAD~2`. Follow the instructions in the two files that git shows, first to pick which commits to squash and then to set your commit message.

When you are finished, push your branch to the github repo using the command `git push origin [branch-name]`. Then, navigate to the list of branches in the code section of the github site and click 'compare and pull request'. Read over your code before submitting. If your work corresponds to a specific issue, your pull request description should be "fix #[issue number]", where the issue number is the number assigned to the issue your PR corresponds to. Github will show a list of potential issues when you type the # symbol, but if your issue is not shown you may need to look up the issue number yourself.

[Here's a link with more info about the process](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html)

## Sass Style Guide

### Code Style

Follow [Hugo Giraudel's Sass Guidelines](https://sass-guidelin.es/#about-the-author). Nested components are OK but avoid >3 levels of nesting.

### Folders

- Use sass/base/ for base level components like application-wide variables and styles. These can be overwritten in more specific component stylesheetes.
- Use sass/components/ for styles specific to application components, like a navbar stylesheet

### Misc

- Prefix partial filenames with an underscore to indicate the file is not a standalone stylesheet
- Group similar include statements together in application.scss
- Make sure the base imports come first
- _variables.scss should always be imported before any other file 
