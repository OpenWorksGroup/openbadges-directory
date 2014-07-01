openbadges-directory
====================

Directory for searching community badge classes.

## Quick Start

    npm install
    npm run gulp                             #runs jshint, mocha, and then starts a watch process
    DATABASE_URL=... npm run-script migrate #creates the database tables needed for directory
    npm start                                #starts the actual search process

    node_modules/.bin/gulp test              #run tests
    node_modules/.bin/gulp integrationTest   #run integration tests (starts the api and makes calls against it)
    node_modules/.bin/gulp lint              #run linter
    node_modules/.bin/gulp watch             #watch

[Badge Class Listing Format](#badgelist)

[Environment Variables](#env_variables)

[Project Structure](#proj_structure)

[API Explorer](#api_explorer)

[API](#api)

[Curl'ing the API](#curl)

[Trying the examples](#examples)

[Invalid Badges](#invalid_badges)

<a name="badgelist" />
## Badge Class Listing Format

Currently, to have your badge classes indexed in the directory, you must expose an endpoint that lists the badges
you want to have indexed. By endpoint, this just means a URL which when accessed returns a JSON message. The message is
very simple and this is a valid example:

    {
      "badgelist": [{
        "location": "http://my-site.com/location-of-badge"
      }, {
        "location": "http://my-site.com/location-of-other-badge"
      }]
    }

There is a root key called "badgelist", which contains an array of badge class locations. These are objects with a single
key of "location", pointing to the url where the badge class is hosted. When the directory retrieves a badge listing it
collects up all of the locations and follows them to their badge class definitions.

For instance, let's say you are a badge issuer called badgetastic and your website is ```http://badgetastic.com```. To participate
in the directory, you would be expected to expose an endpoint somewhere (on your site or otherwise) that lists all of the
badges you want indexed from badgetastic. The url is up to you, but assuming you host it on your site and expose the endpoint
at ```http://badgetastic.com/badgelist``` - hitting that url we would expect to see a listing of badge locations as specified in
the earlier code snippet. Each of these locations would be expected to lead to a valid badge class. For instance:

    {
      "badgelist": [{
        "location": "http://badgetastic.com/badge1"
      }]
    }

Would be expected to have a valid badge class listing at ```http://badgetastic.com/badge1```:

    http://badgetastic.com/badge1
    {
      "name": "Badge 1!",
      "description": "You speak computers and you can use them too.",
      "image": "https://dl.dropboxusercontent.com/s/12829812982/badge1.svg",
      "criteria": "http://badgetastic.com/badge1-criteria",
      "issuer": "http://badgetastic.com/issuer",
      "tags": [
        "Skill",
        "Doer",
        "Realistic"
      ]
    }

As well as inspecting the badge class itself, the directory will try and retrieve the issuer. If the issuer is in a valid
[Issuer Organization](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#issuerorganization) format,
it will be parsed and the issuer name will be searchable in the directory.

## Registering for the directory index

For simplicity, there is a form you can use to register with the directory at http://jpcamara.github.io/openbadges-directory.
Behind the scenes, it hits the directory registration endpoint.

The register endpoint is described in the [API](#api) section.

<a name="env_variables" />
## Environment Variables

Mostly don't need environment variables at the moment, but if you don't want to use the dummy badge store
located in the project itself, you can set the BADGE_STORE environment variable. It should

    BADGE_STORE                             #full path to a JSON file of newline separated JSON objects
    DATABASE_URL                            #URL to mysql - format is mysql://user:pass@host/database
    ES_HOST                                 #(optional) URL to elasticsearch. Defaults to http://localhost:9200
    INDEX_INTERVAL                          #(optional) Interval for indexing issuers in milliseconds. Defaults to 60 seconds.
    EMAIL_SERVICE                           #Uses nodemailer internally, so requires one of the node nodemailer service names (example: 'SendGrid')
    EMAIL_USER                              #Email service user
    EMAIL_PASS                              #Email service password

If you are trying to load the example store for Discovery you'll need the following

    GOOGLE_EMAIL
    GOOGLE_PASSWORD
    GOOGLE_KEY
    URL                                     #The url (protocol, host, port) where your app lives

<a name="proj_structure" />
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

<a name="api_explorer" />
## API Explorer

For an interactive experience with the api, go to /developers/api-explorer. This will load up a swagger powered interface
that can directly invoke the api.

<a name="api" />
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

### /tags

Returns all tags in the directory, sorted by most popular. This endpoint is not paginated, but does
accept a 'limit' query.

*Request*

    /tags

*Response*

    {
      "data": [{
        "technology": 167
      }, {
        "conventional": 109
      }, {
        "organizer": 108
      }, {
        "doer": 91
      }]
    }

### /register

Registers an endpoint for participation in the directory. Registering means that you have an endpoint in the valid badgelist
format (go [here](#badgelist) to see the badgelist specified). The registration involves some required and optional fields.
The fields are:

- **endpoint**: Required field in a URL format. Specifies where the badgelist is being hosted.
- **name**: Required field. Specifies your name.
- **website**: Required field in a URL format. Specifies your website.
- **email**: Required field for contact
- **description**: Optional field to describe who you are and what your purpose for using the directory is
- **organization**: Optional field for a possible organization name

*POST Request*

    /register
    {
      "endpoint": "http://mybadgelist.com/badgelist"
      "name": "Badgelister",
      "website": "http://mybadgelist.com",
      "email": "email@badgelist.com"
      "description": "We are devoted to listing badge classes",
      "organization": ""
    }

*Response*

    {
      "data": { "success": true }
    }

    If there is a failed validation

    {
      "status": "validation failed",
      "errors": {
        "email": {
          "code": "MISSING",
          "field": "email",
          "message": "Field is required"
        }
      }
    }

<a name="curl" />
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

    #get all tags, by popularity
    curl http://localhost:9000/tags

<a name="examples" />
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

<a name="invalid_badges" />
## Invalid badges

This is not part of the standard API, but if you are hosting the directory and want to get a list of invalid badges, this is
how you would hit your elastic search instance.

    #get all invalid badges
    curl -X POST -H "Content-Type: application/json" -d '{"query":{"bool":{"must":[{"term":{"_directory._valid": false}}]}}}' localhost:9200/badge_classes/badge_class/_search?pretty=1&from=0&size=100&sort=_timestamp

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