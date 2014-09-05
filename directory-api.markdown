---
layout: site
---

# Retrieve Badges (API)

The directory API endpoints allow you to retrieve currently indexed badges. At the moment the directory stores badge classes only, although further developments are under discussion. 

With the API, you can retrieve:

* badges matching search parameters
	* _including full text search, tags, badge or issuer name_
* badges recently added to the directory
* specific badges using the badge class location
* badge tags
	* _which you can then use to query for badges_

The API returns a JSON-formatted list of badge classes, which your site or application can then parse and present in any way you choose. The badge class data includes information about what a badge represents, who issued it and the criteria for earning it. 

You can see the badge class information for badges currently in the directory, presented within a Web interface, using the [example browser](http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent). For more information about Badge Classes in Open Badges, see the [specification documents](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

* [API Explorer](#api-explorer)
* [API](#api)
	* [Search](#search)
	* [Recent](#recent)
	* [Badge Location](#badge-location)
	* [Tags](#tags)
* [Libraries and Examples](#libraries-and-examples)


<a name="api-explorer"></a>
## API Explorer

For an interactive experience with the API, visit the [API Explorer](http://test-openbadges-directory.herokuapp.com/developers/api-explorer#!/search/search). This will load up a swagger-powered interface that can directly invoke the API endpoints listed below.


<a name="api"></a>
## API

The API provides various endpoints for retrieving badges classes currently indexed by the directory - see below for details.


<a name="search"></a>
### Search

Returns all badges matching the specified search parameters.


__Available Request Parameters__

<table>
<tr><td><strong>Parameter</strong></td><td><strong>Type</strong></td><td><strong>Description</strong></td></tr>
<tr><td><code>q</code></td><td><em>string</em></td><td>text to use in full text search of badges</td></tr>
<tr><td><code>tags</code></td><td><em>string</em></td><td>comma-separated list of badge tags to match in returned badges - <strong><em>multiple tags create AND condition</em></code></td></tr>
<tr><td><code>name</code></td><td><em>string</em></td><td>name of badge class to return</td></tr>
<tr><td><code>issuer</code></td><td><em>string</em></td><td>name of issuer whose badges should be returned</td></tr>
<tr><td><code>limit</code></td><td><em>integer</em></td><td>how many results to return</td></tr>
<tr><td><code>page</code></td><td><em>integer</em></td><td>page of results to return</td></tr>
</table>


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




<a name="badge-location"></a>
### Badge Location

Returns a specific badge class, based on its location URL (encoded).



__Available Request Parameters__


___NONE___



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




<a name="tags"></a>
### Tags

Returns all tags in the directory, _sorted by most popular_.

___You can use the tag information to carry out [search](#search) queries.___



__Available Request Parameters__


<table>
<tr><td><strong>Parameter</strong></td><td><strong>Type</strong></td><td><strong>Description</strong></td></tr>
<tr><td><code>limit</code></td><td><em>integer</em></td><td>how many results to return</td></tr>
</table>


___Parameter not required.___



__Expected Request__


{% highlight text %}
/tags?limit=10
{% endhighlight %}



__Expected Response__


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
}
{% endhighlight %}



__Response Structure__


* data
	* tag name : number of occurrences



__Potential Errors__


___NONE___




<a name="libraries-and-examples"></a>
## Libraries and Examples

NodeJS: [https://github.com/jpcamara/openbadges-directory-client](https://github.com/jpcamara/openbadges-directory-client )

Example Browser: [http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent](http://test-openbadges-directory.herokuapp.com/examples/browser/#/recent)
