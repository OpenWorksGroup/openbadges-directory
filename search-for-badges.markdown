---
layout: site
---

# Search for Badges

With the Open Badges Directory API, you can search for badge classes matching your chosen parameters. You can carry out full-text search, search for tags, badge names and issuers, optionally combining multiple search parameters into one query. The API `/search` endpoint returns an array of badge classes matching your search terms.

You can play around with the API endpoints using the [Swagger-powered interface](http://directory.openbadges.org/developers/api-explorer#!/search/search).

Let's look at a simple example of using the `/search` endpoint to query for badges, presenting the results in a Web page, with sample code in PHP and JavaScript (node.js).

## Calling the Search Endpoint

The search endpoint is `/search`, with several optional parameters - __although you are required to supply at least one parameter__. The following parameters are supported:

* `q` - string to use in full-text search of badge classes
* `tags` - comma-separated list of strings representing badge tags to match
	* _more than one tag results in an AND condition, so the API will return only those badge classes with all of the tags you include_
* `name` - string to match in the badge class name
* `issuer` - string to match in the badge issuer name

You can also attach pagination parameters:

* `page` - integer representing which page of results to return
* `limit` - integer specifying how many results to return per page
	* _default limit is 10, maximum value is 100_

### Examples

To search for badge classes containing "open badges", you could use the following URL:

{% highlight text %}
http://directory.openbadges.org/search?q=open%20badges
{% endhighlight %}

To search for badges with both "arts" and "technology" tags:

{% highlight text %}
http://directory.openbadges.org/search?tags=arts,technology
{% endhighlight %}

To search for any badges with "maker" in the name:

{% highlight text %}
http://directory.openbadges.org/search?name=maker
{% endhighlight %}

To search for any badges from the issuer "achievery":

{% highlight text %}
http://directory.openbadges.org/search?issuer=achievery
{% endhighlight %}

Combining parameters, to search for badges from the issuer "achievery" with "technology" tags, returning the first two results:

{% highlight text %}
http://directory.openbadges.org/search?tags=technology&issuer=achievery&limit=2
{% endhighlight %}

All of the parameters can be chained together as you require.

### Implementing the Request

You will naturally need to use a method that suits your implementation language or technology, but let's look at example requests to the `/search` endpoint in PHP and node.js. In PHP your code might look something like this:

{% highlight php startinline %}

$curl = curl_init();
//search for all badges with technology tags
$url="http://directory.openbadges.org/search?tags=technology";
curl_setopt($curl, CURLOPT_URL, $url);
//store the result as a variable
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

{% endhighlight %}

The `result` variable will then contain the response from the API.

To achieve this using JavaScript in a node.js app, your code might include something like this:

{% highlight js %}
http.get('http://directory.openbadges.org/search?tags=technology', function(dirRes) {
	var badgeData = "";

	dirRes.on("data", function (resData) {
		badgeData += resData;
	});

	dirRes.on("end", function () {
		//present results
		
	});
});
{% endhighlight %}

You can then access the data returned from the API in the `end` function.

## Processing the Badge Class Data

If your search returned some badge class data, the API will send it in the following structure:

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

You can select the data items you want to display to your site or application users, for example building them into an HTML Web page.

If your search terms could not be matched in any badge classes, the API will respond with an empty array:

{% highlight json %}
{
  "data": []
}
{% endhighlight %}

### Parsing and Output

#### PHP Example

With the PHP example code above, you could process the badge class data returned from the Directory search by first placing the JSON in an array:

{% highlight php startinline %}
$dir_data = json_decode($result, true);
{% endhighlight %}

Then you could iterate over the array and write the results out to HTML:

{% highlight php startinline %}
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

Since the API returns all of the badge class data items, you can select whichever fields you want your users to see. In this case the badge name is written to a heading element, the image to an `img` element and the issuer name combined with the issuer URL to form an HTML link.

The HTML output would be as follows:

{% highlight html %}
<h2>Badge Name</h2>
<img src='http://issuersite.com/badge.png' alt='badge'/>
<p>Issuer: <a href='http://issuersite.com'>Issuer Name</a></p>
{% endhighlight %}

The result could look something like this (with a bit of extra markup and CSS):

![directory-search](https://cloud.githubusercontent.com/assets/6666370/4203235/475b4d28-382e-11e4-92bc-f3e99169826c.png)

Here is the code in a more complete page:

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
$url="http://directory.openbadges.org/search?tags=technology";
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

#### Node Example

To achieve the same results as the PHP example above, in your node.js app `end` function, you could parse the returned JSON from the API as follows:

{% highlight js %}
var badges = JSON.parse(badgeData).data;
{% endhighlight %}

After that you could iterate through the results, writing selected fields from each badge class out to the page:

{% highlight js %}
var out="";
for(b=0; b<badges.length; b++){
	out+="<h2>"+badges[b].name+"</h2>";
	out+="<img src='"+badges[b].image+"' alt='badge'/>";
	out+="<p>Issuer: <a href='"+badges[b].issuer+"'>"+badges[b].issuerResolved.name+"</a></p>";
}
res.send(out);
{% endhighlight %}

The page display would be the same as the picture above with a little extra styling:

{% highlight js %}
app.get('/badges', function(req, res){
	
	http.get('http://directory.openbadges.org/search?tags=technology', function(dirRes) {
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

In the above examples we created simple pages with data retrieved from the Open Badges Directory API search endpoint. You could extend this in your own site or application, for example to allow your users to choose the search terms. However you build your search query, you can present the results in your own custom interface.

To learn more about the badge class structure, see the [Specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

For the other Directory endpoints, see <a href="directory-api">Retrieve Badges</a>.
