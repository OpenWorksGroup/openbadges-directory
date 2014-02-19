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

## API

All endpoints allow for a limit and page field to modify the number of results return, and paginate the results.

    {
      limit: int,
      page: int,
    }

### /search

Returns all badges by a search criteria. Currently allowed to have no criteria, but that may be changed since what is a search
without any criteria?

*Request*

    /search?q=fulltext-search&tags=comma,separated,tags

*Response*

    {
      data: array of badges
    }

### /recent

Returns all recently indexed badges. Does not accept any params.

*Response*

    {
      data: array of badges
    }

## Approach so far + future

This API is a prototype to both integrate with the initial version of openbadges-discovery (https://github.com/mozilla/openbadges-discovery),
and also to serve a starting point for an actual badge directory API for the general badge community/ecosystem.

There are lots of questions surrounding how a directory would best work, and what it would be implemented on.

In terms of crawling and indexing badges:
https://github.com/mozilla/openbadges-discussion/issues/1 - badge indexing

In terms of extending badges (and what impact that may have on searching and retrieving):
https://github.com/mozilla/openbadges-discussion/issues/8 - badge class extensions
https://github.com/mozilla/openbadges-directory/issues/3
https://github.com/mozilla/openbadges-directory/issues/6
https://github.com/mozilla/openbadges-badgekit/issues/91  - location info for badges/badge classes