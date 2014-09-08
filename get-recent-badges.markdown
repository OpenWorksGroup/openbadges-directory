---
layout: site
---

# Get Recent Badges

With the Open Badges Directory API, you can retrieve any badges that have been recently indexed. The `/recent` endpoint accepts optional pagination parameters, allowing you to specify the count and page you want to retrieve. The API returns JSON including the badge class information for each badge returned, which you can then build into your site or application user interface.

You can play around with the API endpoints using the [Swagger-powered interface](http://directory.openbadges.org/developers/api-explorer#!/search/recent).

Let's look at a simple example of using the `/recent` endpoint to present recent badges in a Web page, with sample code in PHP and JavaScript (node.js).

## Calling the Recent Endpoint

The endpoint to retrieve recent badge classes is `/recent`, optionally with pagination parameters attached - the following example URLs are valid options:

{% highlight text %}
http://directory.openbadges.org/recent
http://directory.openbadges.org/recent?page=2&limit=10
{% endhighlight %}

The first example will return all recent badges, while the second will return the second page where each page contains 10 badge classes.

### Implementing the Request

Your approach to calling the endpoint will depend on the language or technology you are working with. The following demonstrates how you might carry out a `GET` request on the `/recent` endpoint in PHP:

{% highlight php %}
$curl = curl_init();
//recent endpoint url
$url="http://directory.openbadges.org/recent";
curl_setopt($curl, CURLOPT_URL, $url);
//store the result as a variable
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);
{% endhighlight %}

When this code executes, the `result` variable will contain the returned JSON badge data from the API. 

To achieve the same effect in a node.js app using JavaScript, your code might use something like this:

{% highlight js %}
http.get('http://directory.openbadges.org/recent', function(dirRes) {
	var badgeData = "";

	dirRes.on("data", function (resData) {
		badgeData += resData;
	});

	dirRes.on("end", function () {
		//present results
		
	});
});
{% endhighlight %}

In the `end` function, your code can process the JSON badge data returned from the API.

## Processing the Badge Class Data

When you call the `/recent` endpoint, the Directory API returns a JSON array including the recent badge classes. The structure is as follows:

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

Your code can select whichever data items you want to display in your site or application.

### Parsing and Output in PHP

In the PHP example, you could decode the JSON returned from the API as follows:

{% highlight php %}
$dir_data = json_decode($result, true);
{% endhighlight %}

This will place the data values from the JSON in arrays, which you can then iterate through and query for the items you are interested in. For example:

{% highlight php %}
//the data array
foreach ($dir_data as $item){
  //each badge in the array
	foreach ($item as $badge){
		echo "<h2>".$badge['name']."</h2>";
		echo "<img src='".$badge['image']."' alt='badge'/>";
		echo "<p>Issuer: <a href='".$badge['issuer']."'>".$badge['issuerResolved']['name']."</a></p>";
	}
}
{% endhighlight %}

For the data above, the code would output something like this for each badge:

{% highlight html %}
<h2>Badge Name</h2>
<img src='http://issuersite.com/badge.png' alt='badge'/>
<p>Issuer: <a href='http://issuersite.com'>Issuer Name</a></p>
{% endhighlight %}

With a little extra markup plus some CSS, here is the result:

![dir-recent](https://cloud.githubusercontent.com/assets/6666370/4191774/3e7add88-3791-11e4-8876-54608a53457b.png)

Here's the code in a complete PHP page for reference:

{% highlight php %}
<!DOCTYPE html>
<html>
<head>
<style type='text/css'>
body, html {font-family:sans-serif; width:60%; margin:auto; text-align:center; color:#333333;}
a:link {text-decoration:none; font-weight:bold; color:#fc9141;}
h1 {color:#ed1922;}
h2 {color:#279ddd;}
div {padding:3%; margin:2%; border:1px dotted #666666;}
img {width:50%;}
</style>
</head>
<body>
<h1>BADGES</h1>

<?php

$curl = curl_init();
//recent endpoint url
$url="http://directory.openbadges.org/recent";
curl_setopt($curl, CURLOPT_URL, $url);
//store the result as a variable
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

$dir_data = json_decode($result, true);

//the data array
foreach ($dir_data as $item){
	//each badge in the array
	foreach ($item as $badge){
		echo "<div>";
		echo "<h2>".$badge['name']."</h2>";
		echo "<img src='".$badge['image']."' alt='badge'/>";
		echo "<p>Issuer: <a href='".$badge['issuer']."'>".$badge['issuerResolved']['name']."</a></p>";
		echo "</div>";
	}
}
?>

</body>
</html>
{% endhighlight %}

### Parsing and Output in Node

Let's do the same in a node.js app. Using the example above as a starting point, inside the `end` function we can parse the badge class data as follows:

{% highlight js %}
var badges = JSON.parse(badgeData).data;
{% endhighlight %}

Then, still in the same block, we can process the badge class contents as follows:

{% highlight js %}
var out="";
for(b=0; b<badges.length; b++){
	out+="<h2>"+badges[b].name+"</h2>";
	out+="<img src='"+badges[b].image+"' alt='badge'/>";
	out+="<p>Issuer: <a href='"+badges[b].issuer+"'>"+badges[b].issuerResolved.name+"</a></p>";
}
res.send(out);
{% endhighlight %}

With a little additional markup and CSS, the results are the same as the PHP example image above. A more complete code excerpt follows:

{% highlight js %}
app.get('/badges', function(req, res){
	
	http.get('http://directory.openbadges.org/recent', function(dirRes) {
		var badgeData = "";

		dirRes.on("data", function (resData) {
			badgeData += resData;
		});

		dirRes.on("end", function () {
			var badges = JSON.parse(badgeData).data;
			var b; var out="<!DOCTYPE html><html><head>"+
				"<style type='text/css'>"+
				"body, html {font-family:sans-serif; width:60%; margin:auto; text-align:center; color:#333333;}"+
				"a:link {text-decoration:none; font-weight:bold; color:#fc9141;}"+
				"h1 {color:#ed1922;}"+
				"h2 {color:#279ddd;}"+
				"div {padding:3%; margin:2%; border:1px dotted #666666;}"+
				"</style>"+
				"</head><body>"+
				"<h1>BADGES</h1>";
			for(b=0; b<badges.length; b++){
				out+="<div>";
				out+="<h2>"+badges[b].name+"</h2>";
				out+="<img src='"+badges[b].image+"' alt='badge'/>";
				out+="<p>Issuer: <a href='"+badges[b].issuer+"'>"+badges[b].issuerResolved.name+"</a></p>";
				out+="</div>";
			}
			out+="</body></html>";
			res.send(out);
		});
	});
});
{% endhighlight %}

## Conclusion

Although these simple examples produce trivial results, you can begin to see how you can use the Open Badges Directory API `/recent` endpoint to retrieve the badge class data for badges recently indexed, building the results into your own custom user interface.

To learn more about the badge class structure, see the [Specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

For the other Directory endpoints, see [Retrieve Badges]('directory-api').
