---
layout: site
---

# Retrieve Badges (API)

The directory API endpoints allow you to query and retrieve badges. Currently the directory stores badge classes only, although further developments are under discussion. With the API, you can retrieve:

* badges matching search parameters
 * _including full text search, tags, badge or issuer name_
* badges recently added to the directory
* specific badges using the badge class location
* badge tags
 * _which you can then use to query for badges_

The API returns a JSON-formatted list of badge classes, which your site or application can then parse and present in any way you choose. The badge class data includes information about what a badge represents, who issued it and the criteria for earning it. You can see the information presented within a Web interface using the [example browser](http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent). For more information about Badge Classes in Open Badges, see the [specification documents](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

* [API Explorer](#api-explorer)
* [API](#api)
 * [Search](#search)
 * [Recent](#recent)
 * [Badge Location](#badge-location)
 * [Tags](#tags)
* [Libraries and Examples](#libraries-and-examples)

## API Explorer

For an interactive experience with the API, visit the [API Explorer](http://test-openbadges-directory.herokuapp.com/developers/api-explorer#!/search/search). This will load up a swagger powered interface that can directly invoke the API endpoints listed below.

## API

The API provides various endpoints for retrieving badges classes currently indexed by the directory:

### Search

Returns all badges matching the specified search parameters.

#### Available Request Parameters

|__Parameter__|__Type__|__Description__|
|:--|:--|:--|
|`q`|_string_|text to use in full text search of badges|
|`tags`|_string_|comma-separated list of badge tags to match in returned badges - ___multiple tags create AND condition___|
|`name`|_string_|name of badge class to return|
|`issuer`|_string_|name of issuer whose badges should be returned|
|`limit`|_integer_|how many results to return|
|`page`|_integer_|page of results to return|

___At least one search parameter is required.___

#### Expected Request

{% highlight text %}
/search?q=text-to-find&tags=tag1,tag2&name=badge-name&issuer=issuer-name
{% endhighlight %}

##### Example Requests

{% highlight text %}
/search?q=maker
/search?tags=technology
/search?name=open%20badges%20explorer
/search?issuer=achievery
/search?q=delegate&issuer=achievery
{% endhighlight %}

#### Expected Response

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

##### Response Structure

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

#### Potential Errors

{% highlight json %}
{
	"code": "BadRequestError",
	"message": "You must specify arguments to execute a search"
}
{% endhighlight %}

### Recent

Returns all recently indexed badges.

#### Available Request Parameters

___NONE___

#### Expected Request

{% highlight text %}
/recent
{% endhighlight %}

#### Expected Response

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

##### Response Structure

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

#### Potential Errors

___NONE___

### Badge Location

Returns a specific badge class, based on its location URL (encoded).

#### Available Request Parameters

___NONE___

#### Expected Request

{% highlight text %}
/http%3A%2F%2Fissuersite.com%2Fbadgeclass
{% endhighlight %}

#### Expected Response

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

##### Response Structure

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

#### Potential Errors

{% highlight json %}
{
  "code": "ResourceNotFound",
  "message": "/http%3A%2F%2Fissuersite.com%2Fbadgeclass does not exist"
}
{% endhighlight %}

### Tags

Returns all tags in the directory, _sorted by most popular_.

___You can use the tag information to carry out [search](#search) queries.___

#### Available Request Parameters

|__Parameter__|__Type__|__Description__|
|:--|:--|:--|
|`limit`|_integer_|how many results to return|

___Parameter not required.___

#### Expected Request

{% highlight text %}
/tags?limit=10
{% endhighlight %}

#### Expected Response

JSON-structured array of badge tags together with the number of times each tag is used by badges currently in the directory.

{% highlight json %}
{
  "data": [
    {
      "technology": 100
    },
    {
      "science": 75
    },
    {
      "design": 53
    },
    ...
  ]
}{% endhighlight %}

##### Response Structure

* data
	* tag name : number of occurrences

#### Potential Errors

___NONE___

## Libraries and Examples

NodeJS: [https://github.com/jpcamara/openbadges-directory-client](https://github.com/jpcamara/openbadges-directory-client )

Example Browser: [http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent](http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent)
