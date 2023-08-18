[![build](https://github.com/jhackshaw/ofnotes/workflows/ofnotes/badge.svg)](https://github.com/jhackshaw/ofnotes/actions)
[![codecov](https://codecov.io/gh/jhackshaw/ofnotes/branch/master/graph/badge.svg)](https://codecov.io/gh/jhackshaw/ofnotes)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jhackshaw/ofnotes)](https://dependabot.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://www.ofnote.site)
![GitHub](https://img.shields.io/github/license/jhackshaw/ofnotes)

### About

Ofnotes is a note taking application that is completely offline with support for live editing markdown and material-design. All notes are stored locally per browser.

![Screen Shot](https://ofnote.site/preview.png)

### Features

- **Markdown**: notes support [github flavored markdown](https://github.github.com/gfm/) and are rendered using material design
- **Tags**: notes can be tagged to make categorizing and finding them quick and easy
- **Indexeddb**: never run out of storage space for notes
- **Dark mode**: essential

#### Built with

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [ReactJS](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [Dexie](https://dexie.org/)
- [React Router](https://reacttraining.com/react-router/)
- [MomentJS](https://momentjs.com/)

#### Continuous Integration

GitHub Actions is used for CI/CD and the site is deployed to netlify. CI configuration can be viewed at [.github/workflows/ofnotes.yml](https://github.com/jhackshaw/ofnotes/blob/master/.github/workflows/ofnotes.yml). Every push to master triggers the following steps:

1. Install nodejs and dependencies (npm ci)
2. Ensure prettier code style (npm format:check)
3. Run tests (npm run test -- --coverage)
4. Upload test coverage to [codecov](https://codecov.io/gh/jhackshaw/ofnotes)
5. Build production application (npm run build)
6. Deploy application to netlify

#### development

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://www.ofnote.site)

- Clone repo:  
  `git clone https://github.com/jhackshaw/ofnotes`
- Install dependencies:  
  `npm install`
- Run tests:  
  `npm run test`
- Run tests with code coverage:  
  `npm run test -- --coverage`
- Run development server:  
  `npm run start`
- Format source:  
  `npm run format`.

Pull requests welcome.
