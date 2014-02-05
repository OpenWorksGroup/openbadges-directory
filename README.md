openbadges-directory
====================

Directory for searching available badges.

## Quick Start

    npm install
    npm run gulp                            #runs jshint, mocha, and then starts a watch process
    npm start                               #starts the actual search process

    node_modules/.bin/gulp test             #run tests
    node_modules/.bin/gulp integrationTest  #run integration tests (starts the api and makes calls against it)
    node_modules/.bin/gulp lint             #run linter
    node_modules/.bin/gulp watch            #watch

## Environment Variables

Mostly don't need environment variables at the moment, but if you don't want to use the dummy badge store
located in the project itself, you can set the BADGE_STORE environment variable. It should

    BADGE_STORE                             #full path to a JSON file of newline separated JSON objects