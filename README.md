openbadges-directory
====================

Directory for searching available badges.

## Quick Start

    npm install
    npm run gulp                             #runs jshint, mocha, and then starts a watch process
    DATABASE_URL=... npm run-scripts migrate #creates the database tables needed for directory
    npm start                                #starts the actual search process

    node_modules/.bin/gulp test              #run tests
    node_modules/.bin/gulp integrationTest   #run integration tests (starts the api and makes calls against it)
    node_modules/.bin/gulp lint              #run linter
    node_modules/.bin/gulp watch             #watch

## Environment Variables

Mostly don't need environment variables at the moment, but if you don't want to use the dummy badge store
located in the project itself, you can set the BADGE_STORE environment variable. It should

    BADGE_STORE                             #full path to a JSON file of newline separated JSON objects
    API_KEY                                 #temporarily hard-coded api key for clients to use to hit the directory.
    DATABASE_URL                            #URL to mysql - format is mysql://user:pass@host/database
    ES_HOST                                 #(optional) URL to elasticsearch. Defaults to http://localhost:9200
    INDEX_INTERVAL                          #(optional) Interval for indexing issuers in milliseconds. Defaults to 60 seconds.

If you are trying to load the example store for Discovery you'll need the following

    GOOGLE_EMAIL
    GOOGLE_PASSWORD
    GOOGLE_KEY
    URL                                     #The url (protocol, host, port) where your app lives

## Project Structure

    /app.js - Starts the cluster
    /config.json - Contains environment variables for local use (.gitignore'd, see config.json.example for a sample)
    /gulpfile.js - Build tasks and tests
    /developers - Contains the api-explorer, the swagger driven ui for interacting with the api directly
    /examples - Example code for hitting the directory from the browser, and from the server
    /lib - All of the main project code
      /api - API endpoint code
      /engine - 'engines' for indexing with either elasticsearch or lunr (elasticsearch by default, lunr isn't persistent or stable)
      /indexer - Worker script that indexes the available endpoints using the 'issuer' table
      /swagger - Swagger setup for the api-explorer
      /test - Short-term code for parsing the discovery badges
      /validator - Contains validation code for badge classes
    /migrations - Contains all of the migrations for the project. Managed using 'db-migrate'
    /test - Contains all the test (spec) files, written using mocha. Run using gulp (see "Quick Start")

## API Explorer

For an interactive experience with the api, go to /developers/api-explorer. This will load up a swagger powered interface
that can directly invoke the api. It requires inputting an api key in the top right corner (where there is an input that
says "api_key") and hitting "Explore".

## API

All endpoints allow for a limit and page field to modify the number of results returned, and paginate the results.

    {
      limit: int,
      page: int
    }

### /search

Returns all badges by a search criteria. Currently allowed to have no criteria, but that may be changed since what is a search
without any criteria?

*Request*

    /search?q=fulltext-search&tags=comma,separated,tags

*Response*

    {
      "data": [array of badges]
    }

### /recent

Returns all recently indexed badges. Does not accept any params.

*Response*

    {
      "data": [array of badges]
    }

### /:badgeLocation

Returns a specific badge class, based on the location url (encoded).

*Request*

    /http%3A%2F%2Fwww.no-reply.com%2F12

*Response*

    {
      "data": {
        "location": "http://www.no-reply.com/12"
        ... badge class attributes ...
      }
    }

## curl'ing the api

    curl http://localhost:9000/recent

    #get by searching all
    curl http://localhost:9000/search?q=better

    #get by searching tags
    curl http://localhost:9000/search?tags=skill

    #get by searching all w/ tags filter
    curl http://localhost:9000/search?tags=skill,doer&q=better

    #get by badge location
    curl http://localhost:9000/http%3A%2F%2Flocalhost%3A9000%2Ftemp%2Fdiscovery%2Flisting%2F837


## Trying the examples

There is an examples folder with a version of the service being proxied for a web client and a simple usecase of a
server-side directory client.

To setup:

    cd examples
    npm install
    npm run-script browserify

To run the client (from the examples folder):

    npm run-script client
    npm run-script server
    #login to http://localhost:3000/example.html

To run the server example (from the examples folder):

    npm run-script server
    node server/example


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

# License

[MPL 2.0](http://www.mozilla.org/MPL/2.0/)

heroku run DATABASE_URL=mysql://:@localhost/dbname?reconnect=true node_modules/.bin/db-migrate up --app appname