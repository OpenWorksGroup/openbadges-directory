---
layout: site
---

The directory is a prototype of an un-opinionated storage and retrieval system for <a href="http://openbadges.org" target="_blank">Open Badges</a> and an open source community project of the <a href="http://wiki.badgealliance.org/index.php/Directory_Working_Group" target="_blank">Directory Working Group</a> in coordination with the <a href="http://badgealliance.org/" target="_blank">Badge Alliance</a>. 


[Add Your Badges](#addbadges) | [Retrieve Badges (API)](#retrieve) | [Additional Resources](#resources)


<a name="addbadges" /></a>
## Add Your Badges

Currently the directory indexes badge classes only. To have your badge classes indexed in the directory, you must expose an endpoint that lists the badges you want to have indexed. By endpoint, this just means a URL which when accessed returns a JSON message. The message is very simple and this is a valid example:

    {
        "badgelist": [{
            "location": "http://my-site.com/location-of-badge"
        }, {
            "location": "http://my-site.com/location-of-other-badge"
        }]
    }
 
When the directory retrieves a badge listing it collects up all of the locations and follows them to their badge class definitions. For instance, let's say you are a badge issuer called badgetastic and your website is http://badgetastic.com. To participate in the directory, you would be expected to expose an endpoint somewhere (on your site or otherwise) that lists all of the badges you want indexed from badgetastic. The url is up to you, but assuming you host it on your site and expose the endpoint at http://badgetastic.com/badgelist - hitting that url we would expect to see a listing of badge locations as specified in the earlier code snippet. Each of these locations would be expected to lead to a valid badge class.

    {
        "badgelist": [{
            "location": "http://badgetastic.com/badge1"
        }]
    }
 
The above would be expected to have a valid badge class listing at http://badgetastic.com/badge1:

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
 
{% include registration-form.html %}

---------------------------------------

<a name="retrieve" /></a>
## Retrieve Badges

[API Explorer](#api_explorer) | [API](#api) | [Curl'ing the API](#curl) | [Approach so far + future](#approach)


<a name="api_explorer" /></a>
### API Explorer

For an interactive experience with the api, go to the [API Explorer](http://test-openbadges-directory.herokuapp.com/developers/api-explorer#!/search/search). This will load up a swagger powered interface that can directly invoke the api.

<a name="api" /></a>
### API

All endpoints allow for a limit and page field to modify the number of results returned, and paginate the results.

    {
      limit: int,
      page: int
    }

#### /search

Returns all badges by a search criteria. Currently allowed to have no criteria, but that may be changed since what is a search
without any criteria?

*Request*

    /search?q=fulltext-search&tags=comma,separated,tags

*Response*

    {
      "data": [array of badges]
    }

#### /recent

Returns all recently indexed badges. Does not accept any params.

*Response*

    {
      "data": [array of badges]
    }

#### /:badgeLocation

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

#### /tags

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

<a name="curl" /></a>
### Curl'ing the API

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

<a name="approach" /></a>
### Approach so far + future

This API is a prototype to both integrate with the initial version of [openbadges-discovery](https://github.com/mozilla/openbadges-discovery),
and also to serve a starting point for an actual badge directory API for the general badge community/ecosystem.

There are lots of questions surrounding how a directory would best work, and what it would be implemented on.

In terms of crawling and indexing badges:
[https://github.com/mozilla/openbadges-discussion/issues/1 - badge indexing](https://github.com/mozilla/openbadges-discussion/issues/1)

In terms of extending badges (and what impact that may have on searching and retrieving):
* [https://github.com/mozilla/openbadges-discussion/issues/8 - badge class extensions](https://github.com/mozilla/openbadges-discussion/issues/8 )
* [https://github.com/mozilla/openbadges-directory/issues/3](https://github.com/mozilla/openbadges-directory/issues/3)
* [https://github.com/mozilla/openbadges-directory/issues/6](https://github.com/mozilla/openbadges-directory/issues/6)
* [https://github.com/mozilla/openbadges-badgekit/issues/91  - location info for badges/badge classes](https://github.com/mozilla/openbadges-badgekit/issues/91)


<a name="resources" /></a>
##Additional Resources

* [Open Badges](http://openbadges.org)
* [Badge Alliance](http://badgealliance.org/)
* [Directory Working Group](http://wiki.badgealliance.org/index.php/Directory_Working_Group)
* [Open Badges Directory on Github](https://github.com/mozilla/openbadges-directory)

#### License

[MPL 2.0](http://www.mozilla.org/MPL/2.0/)

