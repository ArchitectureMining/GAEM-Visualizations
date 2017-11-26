# GAEM-Visualizations
A set of SVG software behavior visualizations generated with javascript for the GAEM thesis project.\

## Code quality
This is a prototype for research purposes, it's not pretty, it not robust and it's not flexible. However it works well enough for the purpose for which it was intended.

## Requirements
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (or [NPM](https://www.npmjs.com/))

### NPM users
Instead of `yarn`, run `npm install`, for all other commands replace all `yarn` with `npm`, it should work as no direct yarn commands are used in the scripts.

## Getting started
Download the project and run in project root. 
Then run yarn to install all dependencies:

```bash
$ yarn
```
To start the server run:
```bash
$ yarn run start-prod
```

## Getting started developing
Download the project and run in project root.
Then run yarn to install all dependencies:

```bash
$ yarn
```

To start the server with all tools watching for file changes run:

```bash
$ yarn run start-dev
```

TSlint does not watch for file changes as is. Use a plugin or run it manually yourself.

## Project core dependencies
- [D3.js](https://d3js.org/)
- [Neo4j JavaScript driver](https://github.com/neo4j/neo4j-javascript-driver)

## People
*empty for now, communicating who wants/should be here*

## License
[ISC](LICENSE)
