---
layout: site
---

# Retrieve Badges (API)

The directory API endpoints allow you to retrieve currently indexed badges. At the moment the directory stores badge classes only, although further developments are under discussion. 

To have your badges indexed by the directory or to find out more about the project, see the [home page](http://directory.openbadges.org).

With the API, you can retrieve:

* badges matching search parameters
	* _including full text search, tags, badge or issuer name_
* badges recently added to the directory
* specific badges using the badge class location
* badge tags
	* _which you can then use to search for badges_

___The API uses ElasticSearch.___

The Directory API endpoints return JSON-formatted badge class data, which your site or application can then parse and present in any way you choose. The badge class data includes information about what a badge represents, who issued it and the criteria for earning it. 

You can see the badge class information for badges currently in the directory, presented within a Web interface, using the [example browser](http://directory.openbadges.org/examples/browser/#/recent). For more information about Badge Classes in Open Badges, see the [specification documents](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

* [API Explorer](#api-explorer)
* [API](#api)
	* [Search](#search)
	* [Recent](#recent)
	* [Badge Location](#badge-location)
	* [Tags](#tags)
* [Libraries and Examples](#libraries-and-examples)


<a name="api-explorer"></a>
## API Explorer

For an interactive experience with the API, visit the [API Explorer](http://directory.openbadges.org/developers/api-explorer#!/search/search). This will load up a swagger-powered interface that can directly invoke the API endpoints listed below.

<a name="api"></a>
## API

The API provides various endpoints for retrieving badge classes currently indexed by the directory.

<a name="search"></a>
### Search

Returns all badges matching the specified search parameters.

__Available Request Parameters__

| &nbsp;__Parameter__&nbsp; | &nbsp;__Type__&nbsp; | &nbsp;__Description__&nbsp; |
| :------------ | :------- | :-------------- |
| &nbsp;`q`&nbsp; | &nbsp;_string_&nbsp; | &nbsp;text to use in full text search of badges&nbsp; |
| &nbsp;`tags`&nbsp; | &nbsp;_string_&nbsp; | &nbsp;comma-separated list of badge tags to match in returned badges - ___multiple tags create AND condition___&nbsp; |
| &nbsp;`name`&nbsp; | &nbsp;_string_&nbsp; | &nbsp;name of badge class to return&nbsp; |
| &nbsp;`issuer`&nbsp; | &nbsp;_string_&nbsp; | &nbsp;name of issuer whose badges should be returned&nbsp; |
| &nbsp;`limit`&nbsp; | &nbsp;_integer_&nbsp; | &nbsp;how many results to return per page (default 10, max 100)&nbsp; |
| &nbsp;`page`&nbsp; | &nbsp;_integer_&nbsp; | &nbsp;page of results to return&nbsp; |

___At least one search parameter is required.___

__Expected Request__

{% highlight text %}
/search?q=text-to-find&tags=tag1,tag2&name=badge-name&issuer=issuer-name
{% endhighlight %}

__Example Requests__

{% highlight text %}
/search?q=maker
/search?tags=technology
/search?name=open%20badges%20explorer
/search?issuer=achievery
/search?q=delegate&issuer=achievery
{% endhighlight %}

__Expected Response__

JSON-structured array of badge classes matching the search parameters, or an empty array if no matching badges are returned.

{% highlight json %}
{
  "data": [
    {
      "name": "Badge Name",
      "description": "Badge description.",
      "image": "http://issuersite.com/badge.png",
      "tags": [
        "tag1",
        "tag2",
        ...
      ],
      "issuer": "http://issuersite.com",
      "criteria": "http://issuersite.com/criteria.html",
      "alignment": [
        {
          "name": "Alignment Name",
          "url": "http://alignmentsite.com",
          "description": "Alignment desription."
        }
      ],
      "_directory": {
        "_location": "http://issuersite.com/badgeclass",
        "_valid": true,
        "_timestamp": 1409852679994
      },
      "issuerResolved": {
        "name": "Issuer Name"
      }
    },
    {
      "name": "Badge Name",
      "description": "Badge description.",
      ...
    },
    ...
  ]
}
{% endhighlight %}

__Response Structure__

* data `[ ]`
	* name
	* description
	* image
	* tags `[ ]`
	* issuer
	* criteria
	* alignment `[ ]`
		* name
		* url
		* description
	* &#95;directory
		* &#95;location
		* &#95;valid
		* &#95;timestamp
	* issuerResolved
		* name

__Potential Errors__

{% highlight json %}
{
	"code": "BadRequestError",
	"message": "You must specify arguments to execute a search"
}
{% endhighlight %}

_For more on the `/search` endpoint, see <a href="search-for-badges">Search For Badges</a>._

<a name="recent"></a>
### Recent

Returns all recently indexed badges.

__Available Request Parameters__

___NONE___

__Expected Request__

{% highlight text %}
/recent
{% endhighlight %}

__Expected Response__

JSON-structured array of badge classes recently indexed by the directory.

{% highlight json %}
{
  "data": [
    {
      "name": "Badge Name",
      "description": "Badge description.",
      "image": "http://issuersite.com/badge.png",
      "tags": [
        "tag1",
        "tag2",
        ...
      ],
      "issuer": "http://issuersite.com",
      "criteria": "http://issuersite.com/criteria.html",
      "alignment": [
        {
          "name": "Alignment Name",
          "url": "http://alignmentsite.com",
          "description": "Alignment desription."
        }
      ],
      "_directory": {
        "_location": "http://issuersite.com/badgeclass",
        "_valid": true,
        "_timestamp": 1409852679994
      },
      "issuerResolved": {
        "name": "Issuer Name"
      }
    },
    {
      "name": "Badge Name",
      "description": "Badge description.",
      ...
    },
    ...
  ]
}
{% endhighlight %}

__Response Structure__

* data `[ ]`
	* name
	* description
	* image
	* tags `[ ]`
	* issuer
	* criteria
	* alignment `[ ]`
		* name
		* url
		* description
	* &#95;directory
		* &#95;location
		* &#95;valid
		* &#95;timestamp
	* issuerResolved
		* name

__Potential Errors__

___NONE___

_For more on the `/recent` endpoint, see <a href="get-recent-badges">Get Recent Badges</a>._

<a name="badge-location"></a>
### Badge Location

Returns a specific badge class, based on its location URL (encoded).

___NB:___ The location of a badge class is found within the `_directory._location` field, which is present in the data for each badge returned from the API endpoints `/recent` and `/search`. _You can therefore combine the location endpoint with those other endpoints if that suits the purpose of your site or application._

__Available Request Parameters__

The encoded badge class location, appended to the Directory URL.

__Expected Request__

{% highlight text %}
/http%3A%2F%2Fissuersite.com%2Fbadgeclass
{% endhighlight %}

__Expected Response__

JSON-structured object containing requested badge class.

{% highlight json %}
{
  "data": {
      "name": "Badge Name",
      "description": "Badge description.",
      "image": "http://issuersite.com/badge.png",
      "tags": [
        "tag1",
        "tag2",
        ...
      ],
      "issuer": "http://issuersite.com",
      "criteria": "http://issuersite.com/criteria.html",
      "alignment": [
        {
          "name": "Alignment Name",
          "url": "http://alignmentsite.com",
          "description": "Alignment desription."
        }
      ],
      "_directory": {
        "_location": "http://issuersite.com/badgeclass",
        "_valid": true,
        "_timestamp": 1409852679994
      },
      "issuerResolved": {
        "name": "Issuer Name"
      }
    }
}
{% endhighlight %}

__Response Structure__

* data
	* name
	* description
	* image
	* tags `[ ]`
	* issuer
	* criteria
	* alignment `[ ]`
		* name
		* url
		* description
	* &#95;directory
		* &#95;location
		* &#95;valid
		* &#95;timestamp
	* issuerResolved
		* name

__Potential Errors__

{% highlight json %}
{
  "code": "ResourceNotFound",
  "message": "/http%3A%2F%2Fissuersite.com%2Fbadgeclass does not exist"
}
{% endhighlight %}

_For more on the `/{location}` endpoint, see <a href="badge-from-location">Get a Badge from its Location</a>._

<a name="tags"></a>
### Tags

Returns all tags in the directory, _sorted by most popular_.

___You can use the tag information to carry out [search](#search) queries.___

__Available Request Parameters__

| &nbsp;__Parameter__&nbsp; | &nbsp;__Type__&nbsp; | &nbsp;__Description__&nbsp; |
| :------------ | :------- | :-------------- |
| &nbsp;`limit`&nbsp; | &nbsp;_integer_&nbsp; | &nbsp;how many results to return (default 10, max 100)&nbsp; |

___Parameter not required.___

__Expected Request__

{% highlight text %}
/tags
/tags?limit=10
{% endhighlight %}

__Expected Response__

JSON-structured array of badge tags together with the number of times each tag occurs (for badges currently in the directory).

{% highlight json %}
{
  "data": [
    {
      "tag": "technology",
      "count": 100
    },
    {
      "tag": "science",
      "count": 60
    },
    {
      "tag": "design",
      "count": 40
    },
    ...
  ]
}
{% endhighlight %}

__Response Structure__

* data
	* tag
	* count

__Potential Errors__

___NONE___

_For more on the `/tags` endpoint, including an overview of how you can combine it with the `/search` endpoint, see <a href="find-badge-tags">Find Badge Tags</a>._

<a name="libraries-and-examples"></a>
## Libraries and Examples

NodeJS: [https://github.com/jpcamara/openbadges-directory-client](https://github.com/jpcamara/openbadges-directory-client )

Example Browser: [http://directory.openbadges.org/examples/browser/#/recent](http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent)
