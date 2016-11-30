# ELISA
A simple shopping list app with addtional convenience features to improve the shopping experience.

## Features
- [ ] [Core shopping list functionality](https://github.com/riedmaph/elisa/milestone/1)
- [ ] [Multi-user editing](https://github.com/riedmaph/elisa/milestone/2)
- [ ] [Data Mining of Super market information](https://github.com/riedmaph/elisa/milestone/3)
- [ ] [Special offer notifications](https://github.com/riedmaph/elisa/milestone/4)
- [ ] [List optimization](https://github.com/riedmaph/elisa/milestone/5)
- [ ] [Multi-list support](https://github.com/riedmaph/elisa/milestone/7)
- [ ] [Habit-learning](https://github.com/riedmaph/elisa/milestone/6)
- [ ] [Recipe-database integration](https://github.com/riedmaph/elisa/milestone/8)


## Tech-Stack

### Frontend
- [Docker](http://www.docker.com)
- [nginx](http://nginx.org)
- [node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org)
- [Angular2](https://angular.io)

### Backend API
- [node.js](https://nodejs.org/)
- [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [swagger](http://swagger.io/)

## Setup

### Frontend
- Install dependencies: `npm install`
- Build: `npm run build:dev` or `npm run watch:dev`
- Webserver Docker: `docker-compose up`
- Simple dev server `npm start`
- Run unit tests: `npm test` (Coverage reports are found in `/coverage`)
- Run end to end tests: `npm run e2e`

### Backend API
- Install dependencies: `npm install`
- Simple dev server `npm start`

## Code-Style
### Git-Workflow
- No commits to `master`
- A user story has its own branch named `story-X` where `X` is the number of the story
- Sub-tasks have their own branch named `task-X-Y-AB` where `X` is the number of the story, `Y` the number of the task and `AB` are the initals of the responsible developer
- If a task is not associated with a story the story number can be omitted
- Branches may have a brief description at the end of their name, e.g. `task-12-37-tw-Login-styling`
- [On the subject of commit-messages](http://chris.beams.io/posts/git-commit/)

- Coding happens in the task-branches
- Once complete and conforming to the DoD a pull request is opened to merge the changes into the story-branch after peer review
- Once all task of a story are merged into the story branch it can be merged into master by pull request; rebase onto master as necessary
- Commit-messages that are very similar or trivial changes (e.g. typo-fixes) can be squashed away on the task-branch

### Language
- All Code (Variables, Constants, Classes etc.) is in English
- All Comments are in English

### Source Code
- Everything (Source, Config, Docs...) is UTF-8, no exceptions
- No Tabstops in Source Files, only Spaces are acceptable
- __JavaScript__ and __TypeScript__ use __2__-space indent
- __CSS__ and __SASS__ use __4__-space indent

### TypeScript
- [Angular Style-Guide](https://angular.io/styleguide)
- [TypeScript Style-Guide](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)
- Components are suffixed by `Component`, Services by `Service`, Directives by `Directive`
- Selectors are prefixed by `sl-`
- File names are lowercase. Components end on `.component.ts`, services on `.service.ts`, directives on `.directive.ts`, templates on `.template.html`, stylesheets on `.style.scss` or `.style.css`

## Definition of Done
- All requirements are met.

- Changes to the requirements are documented.
- All public interfaces and API endpoints are documented.
- Private and protected code need not be documented. Use common sense.
- Story-documentation is current.

- Code is linting error free.
- The code contains no FIXMEs or similar tags. TODOs only if optional.
- The code contains no temporary development hacks.

- Program logic is unit tested.
- API endpoints are unit tested.
- New UI components are end-to-end tested.
- All tests are successful.

- Changes are peer reviewed.
- Conformance to the requirements was checked by a peer.
- Code is merged into the master branch.
