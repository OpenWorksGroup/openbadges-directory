---
layout: site
---

# Get a Badge from its Location

The Open Badges Directory API provides the ability to retrieve badges in various ways. With the `/{location}` endpoint, you can retrieve a particular badge class using its location. You may find this useful particularly in conjunction with the other endpoints, for example if you provide your users with an option to view more details on a listed badge.

To call on the location endpoint, all you need to do is append the badge location to the Directory URL. The API will return a JSON-formatted object containing the badge class, which you can then process, presenting the data within your site or application.

You can play around with the API endpoints using the [Swagger-powered interface](http://directory.openbadges.org/developers/api-explorer#!/search/byUrl).

Let's look at a simple example of using the `/{location}` endpoint to present the details for a particular badge in a Web page, with sample code in PHP and JavaScript (node.js).

## Calling the Location Endpoint

The location endpoint is reached simply by adding the encoded URL of the badge class to the Directory URL, as in the following examples:

{% highlight text %}
http://directory.openbadges.org/http%3A%2F%2Fissuersite.com%2Fbadgeclass
http://directory.openbadges.org/http%3A%2F%2Fapi.badgekit.org%2Fpublic%2Fsystems%2Fopenbadges-badges%2Fbadges%2Fopen-badgineer
{% endhighlight %}

These represent the following badge locations:

{% highlight text %}
http://issuersite.com/badgeclass
http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer
{% endhighlight %}

You can encode your badge class URL programmatically as we'll see below.

If your site or application is using the other API endpoints to retrieve badge classes, you will find the location of a badge class in its `_directory._location` field. _When the Directory indexes an issuer's badge list, it retrieves each badge class from its location - this location is then stored in the Directory alongside the badge class data, allowing users of the API to find the original location of a badge from its Directory listing._

### Implementing the Request

Your approach will need to suit the language or technology you are working with. To encode the badge class URL and make a `GET` request for the data from the directory, you could use the following syntax in PHP:

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

The `result` variable will contain the badge data returned from the API when this code executes.

With JavaScript in a node.js app, you could take the following approach:

{% highlight js %}
var encodedLocation=encodeURIComponent("http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer");
	http.get('http://directory.openbadges.org/'+encodedLocation, function(dirRes) {
	var badgeData = "";

	dirRes.on("data", function (resData) {
		badgeData += resData;
	});

	dirRes.on("end", function () {
		//present results
		
	});
});
{% endhighlight %}

You would then be able to access the badge data returned from the API in the `end` function.

## Processing the Badge Class Data

When you call on the location endpoint, the Directory API will return the badge class data for the badge whose location URL you passed as parameter - ___or "Not Found" if no badge class was found at the specified location___.

If your call was a success, the API response will have the following structure:

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

You can select the data items you want to build into your user interface.

### Parsing and Output

#### PHP Example

To decode the JSON returned from the Directory API in PHP, you could use something like this:

{% highlight php startinline %}
$dir_data = json_decode($result, true);
{% endhighlight %}

The values are then placed in an array, from which you can retrieve each item you want using the field name:

{% highlight php startinline %}
foreach ($dir_data as $item){
	echo "<div class='badges'>";
	echo "<h2>".$item['name']."</h2>";
	echo "<img src='".$item['image']."' alt='badge'/>";
	echo "<p><em>".$item['description']."</em></p>";
	echo "<p><a href='".$item['criteria']."'>View the Criteria</a> for earning this badge</p>";
	echo "<p><strong>Issuer</strong>: <a href='".$item['issuer']."'>".$item['issuerResolved']['name']."</a></p>";
	echo "</div>";
}
{% endhighlight %}

In this example we retrieve the badge name, image, description, criteria URL, issuer URL and issuer name, writing these out to appropriate HTML elements. The output would be structured something like this:

{% highlight html %}
<h2>Badge Name</h2>
<img src='http://issuersite.com/badge.png' alt='badge'/>
<p><em>Badge description...</em></p>
<p><a href='http://issuersite.com/criteria'>View the Criteria</a> for earning this badge</p>
<p><strong>Issuer</strong>: <a href='http://issuersite.com'>Issuer Name</a></p>
{% endhighlight %}

Here's the result with a small amount of extra markup and CSS:

![directory-location](https://cloud.githubusercontent.com/assets/6666370/4238332/8393e34a-39d7-11e4-9928-e29012bf26d3.png)

A more complete script for this result:

{% highlight php %}
<!DOCTYPE html>
<html>
<head>
<style type='text/css'>
body, html {font-family:sans-serif; font-size:small; width:65%; margin:auto; text-align:center; color:#333333;}
a {text-decoration:none; font-weight:bold; color:#fc9141;}
h1 {color:#ed1922;}
h2 {color:#279ddd;}
div.badges {padding:3%; margin:2%; border:1px dotted #666666;}
</style>
</head>
<body>
<h1>BADGE</h1>

<?php

$curl = curl_init();
//encode the badge location
$encoded_location=urlencode("http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer");
$url="http://directory.openbadges.org/".$encoded_location;
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

$dir_data = json_decode($result, true);
foreach ($dir_data as $item){
//process the badge class data and output
	echo "<div class='badges'>";
	echo "<h2>".$item['name']."</h2>";
	echo "<img src='".$item['image']."' alt='badge'/>";
	echo "<p><em>".$item['description']."</em></p>";
	echo "<p><a href='".$item['criteria']."'>View the Criteria</a> for earning this badge</p>";
	echo "<p><strong>Issuer</strong>: <a href='".$item['issuer']."'>".$item['issuerResolved']['name']."</a></p>";
	echo "</div>";
}

?>

</body>
</html>
{% endhighlight %}

#### Node Example

Let's explore how you could achieve the same result in a node.js app. In the `end` function we included earlier, we could parse the JSON badge class data as follows:

{% highlight js %}
var badge = JSON.parse(badgeData).data;
{% endhighlight %}

Then we could retrieve the relevant fields and write them out in HTML:

{% highlight js %}
var out="";
out+="<h2>"+badge.name+"</h2>";
out+="<img src='"+badge.image+"' alt='badge'/>";
out+="<p><em>"+badge.description+"</em></p>";
out+="<p><a href='"+badge.criteria+"'>View the Criteria</a> for earning this badge</p>";
out+="<p><strong>Issuer</strong>: <a href='"+badge.issuer+"'>"+badge.issuerResolved.name+"</a></p>";
res.send(out);
{% endhighlight %}

The result is the same as the PHP example above, with a little extra code completing the effect:

{% highlight js %}
app.get('/location', function(req, res){
	
	var encodedLocation=encodeURIComponent("http://api.badgekit.org/public/systems/openbadges-badges/badges/open-badgineer"); 
	http.get('http://directory.openbadges.org/'+encodedLocation, function(dirRes) {
		var badgeData = "";

		dirRes.on("data", function (resData) {
			badgeData += resData;
		});

		dirRes.on("end", function () {
			var badge = JSON.parse(badgeData).data;
			var b; var out="<!DOCTYPE html>"+
				"<html>"+
				"<head>"+
				"<style type='text/css'>"+
				"body, html {font-family:sans-serif; font-size:small; width:65%; margin:auto; text-align:center; color:#333333;}"+
				"a {text-decoration:none; font-weight:bold; color:#fc9141;}"+
				"h1 {color:#ed1922;}"+
				"h2 {color:#279ddd;}"+
				"div {padding:3%; margin:2%; border:1px dotted #666666;}"+
				"</style>"+
				"</head>"+
				"<body>"+
				"<h1>BADGE</h1>";
			out+="<div>";
			out+="<h2>"+badge.name+"</h2>";
			out+="<img src='"+badge.image+"' alt='badge'/>";
			out+="<p><em>"+badge.description+"</em></p>";
			out+="<p><a href='"+badge.criteria+"'>View the Criteria</a> for earning this badge</p>";
			out+="<p><strong>Issuer</strong>: <a href='"+badge.issuer+"'>"+badge.issuerResolved.name+"</a></p>";
			out+="</div>";
			out+="</body></html>";
			res.send(out);
		});
	});
});
{% endhighlight %}

## Conclusion

The examples above show how you can build information about a badge into your user interfaces, including the badge description and links to the issuer site/ criteria for earning the badge. 

You may find you are most likely to combine the location endpoint with other endpoints in the API, such as the `/recent` and `/search` endpoints, from which you can retrieve the location for each badge class indexed in the directory.

To learn more about the badge class structure, see the [Specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

For the other Directory endpoints, see <a href="directory-api">Retrieve Badges</a>.
