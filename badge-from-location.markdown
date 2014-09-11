---
layout: site
---

# Get a Badge from its Location

The Open Badges Directory API provides the ability to retrieve badges in various ways. With the `/{location}` endpoint, you can retrieve a particular badge class using its location. You may find this useful particularly in conjunction with the other endpoints, for example if you provide your users with an option to view more details on a listed badge.

To call on the location endpoint, all you need to do is append the badge location to the Directory URL. The API will return a JSON-formatted object containing the badge class, which you can then process and present data from within your site or application.

You can play around with the API endpoints using the [Swagger-powered interface](http://directory.openbadges.org/developers/api-explorer#!/search/byUrl).

Let's look at a simple example of using the `/{location}` endpoint to present recent badges in a Web page, with sample code in PHP and JavaScript (node.js).

## Calling the Location Endpoint

The location endpoint is reached simply by adding the encoded URL of the badge class to the Directory location, as in the following example:

{% highlight text %}
http://directory.openbadges.org/http%3A%2F%2Fapi.badgekit.org%2Fpublic%2Fsystems%2Fopenbadges-badges%2Fbadges%2Fopen-badgineer
{% endhighlight %}

This represents the following badge location:

{% highlight text %}
http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer
{% endhighlight %}

You can encode the URL programmatically as we'll see below.

If your site or application is using the other API endpoints to retrieve badge classes, you will find the location of a badge class in its `_directory._location` field.

### Implementing the Request

You will need to take an approach to suit the language or technology you are working with. To encode the badge class URL and make a `GET` request for the data from the directory, you could use the following syntax:

{% highlight php startinline %}

$curl = curl_init();
//encode and append to directory url
$encoded_location=urlencode("http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer");
$url="http://directory.openbadges.org/".$encoded_location;
curl_setopt($curl, CURLOPT_URL, $url);
//store the result as a variable
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

{% endhighlight %}

This example includes the badge location as a hard-coded string for demonstration, but in your own projects you would be more likely to retrieve it from somewhere, such as the other Directory endpoints.
