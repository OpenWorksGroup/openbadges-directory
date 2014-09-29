---
layout: site
---

# Find Badge Tags

The Open Badges Directory API endpoints provide various ways to retrieve the data for badge classes. With the `/tags` endpoint, you can retrieve a list of tags currently used by badges in the directory. In your site or application, you could then use this data to carry out a search for badge classes with particular tags. The tags allow you to find groups of badges on a related subject, activity type or theme.

You can play around with the API endpoints using the [Swagger-powered interface](http://test-openbadges-directory.herokuapp.com/developers/api-explorer#!/search/getTags).

Let's look at a simple example of using the `/tags` endpoint to find badge tags, building the results into a page in which the user can select a tag. When the user selects a tag, we will use this to make a second API call to the `/search` endpoint, presenting the relevant badges in a Web page. The sample code will demonstrate in PHP and JavaScript (node.js).

## Calling the Tags Endpoint

The `/tags` endpoint accepts an optional `limit` parameter to specify the number of results to return. The following sample URLs are valid for this endpoint:

{% highlight text %}
http://directory.openbadges.org/tags
http://directory.openbadges.org/tags?limit=10
{% endhighlight %}

### Implementing the Request

How you go about calling the `/tags` endpoint will depend on your site language or technology. In PHP, your code might look like this:

{% highlight php startinline %}

$curl = curl_init();
//retrieve all tags
$url="http://directory.openbadges.org/tags";
curl_setopt($curl, CURLOPT_URL, $url);
//store the result as a variable
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

{% endhighlight %}

You can then access the tags via the `result` variable.

In a node.js app your JavaScript might do something like this:

{% highlight js %}
http.get('http://directory.openbadges.org/tags', function(dirRes) {
	var badgeData = "";

	dirRes.on("data", function (resData) {
		badgeData += resData;
	});

	dirRes.on("end", function () {
		//present results
		
	});
});
{% endhighlight %}

You can then access the tags in the `end` function.

## Processing the Tag Data

The Directory API will return the badge tag data in a JSON array, with each entry including the tag name and count (how many times the tag occurs within indexed badges):

{% highlight json %}
{
	"data": [
	{
		"tag": "education",
		"count": 100
	},
	{
		"tag": "technology",
		"count": 70
	},
	{
		"tag": "arts",
		"count": 50
	},
	...
  ]
}
{% endhighlight %}

_The API will return the tags in sorted order, with most popular first._

You can select the tag and count data to carry out further processing to suit your own site or application - for example, you could use the tag names to carry out searches for relevant badge classes, which we will demonstrate below.

### Parsing and Output

#### PHP Example

When processing the tag data in PHP, you could use the following approach to decode the JSON and store the results in an array structure:

{% highlight php startinline %}
$dir_data = json_decode($result, true);
{% endhighlight %}

You could then iterate over the array, writing each tag name into a link element (linking to a page we will later use to carry out a badge search):

{% highlight php startinline %}
//the data array
foreach ($dir_data as $item){
	//each tag in the array
	foreach ($item as $tag){
		echo "<a href='badge-search.php?tag=".$tag['tag']."'>".$tag['tag']."</a>";
	}
}
{% endhighlight %}

This would write each tag name out within an anchor element, with the link pointing to a page called "badge-search.php", appended with a parameter named "tag" whose value is the tag name. In that page we can search for badges using the selected tag.

The HTML output would be something like this:

{% highlight html %}
<a href='badge-search.php?tag=education'>education</a>
<a href='badge-search.php?tag=technology'>technology</a>
<a href='badge-search.php?tag=arts'>arts</a>
<!--and so on-->
{% endhighlight %}

This is the result with a little extra markup and styling:

![directory-tags](https://cloud.githubusercontent.com/assets/6666370/4205180/c715b88c-383d-11e4-9f42-6f6e459a227a.png)

_You could optionally also include the tag count in each link, so that the user can see how many badge classes each tag is associated with._

For reference, here is the complete page for this image:

{% highlight php %}
<!DOCTYPE html>
<html>
<head>
<style type='text/css'>
body, html {font-family:sans-serif; width:60%; margin:auto; text-align:center; color:#333333;}
a {text-decoration:none; font-weight:bold; background:#b4ddf3; padding:3px; margin:3px; border-radius:3px; display:inline-block;}
a:link {color:#fc9141;}
a:visited {color:#279ddd;}
h1 {color:#ed1922;}
div.badges {padding:3%; margin:2%; border:1px dotted #666666;}
div.info {clear:both; padding:5%;}
</style>
</head>
<body>
<h1>BADGES</h1>

<?php

$curl = curl_init();
//tags endpoint
$url="http://directory.openbadges.org/tags";
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);
$dir_data = json_decode($result, true);

//data array
foreach ($dir_data as $item){
	echo "<div class='badges'>";
	//each tag
	foreach ($item as $tag){
		echo "<a href='badge-search.php?tag=".$tag['tag']."'>".$tag['tag']."</a>";
	}
	echo "<div class='info'>Choose a tag to see badges!</div></div>";
}

?>

</body>
</html>
{% endhighlight %}

When the user clicks one of the tag links, we take them to the "badge-search.php" page, in which we could carry out another API call, this time to the `/search` endpoint:

{% highlight php startinline %}
$curl = curl_init();
//get the tag from the query string parameter, pass to search endpoint
$url="http://directory.openbadges.org/search?tags=".$_GET['tag'];
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);
$dir_data = json_decode($result, true);

//data array
foreach ($dir_data as $item){
  //each badge
	foreach ($item as $badge){
		echo "<div>";
		echo "<h2>".$badge['name']."</h2>";
		echo "<img src='".$badge['image']."' alt='badge'/>";
		echo "<p>Issuer: <a href='".$badge['issuer']."'>".$badge['issuerResolved']['name']."</a></p>";
		echo "</div>";
	}
}
{% endhighlight %}

With the badge tag name being retrieved from the URL as a passed `GET` variable, this would result in the same output we achieve in the <a href="search-for-badges">Search For Badges</a> page:

![directory-search](https://cloud.githubusercontent.com/assets/6666370/4203235/475b4d28-382e-11e4-92bc-f3e99169826c.png)

#### Node Example

Let's explore how to implement the above effect in a node.js app. In the `end` function we included earlier, we could parse the tag JSON returned from the API as follows:

{% highlight js %}
var tags = JSON.parse(badgeData).data;
{% endhighlight %}

The `tags` variable would then contain the parsed JSON tag data. We could then write this data out into links as follows:

{% highlight js %}
var out="";
for(b=0; b<tags.length; b++){
	out+="<a href='badge-search?tag="+tags[b].tag+"'>"+tags[b].tag+"</a>";
}
res.send(out);
{% endhighlight %}

As above, we build the tag name into a link to another page named "badge-search". Here is a more complete excerpt with some extra styling:

{% highlight js %}
app.get('/tags', function(req, res){
	
	http.get('http://directory.openbadges.org/tags', function(dirRes) {
		var badgeData = "";

		dirRes.on("data", function (resData) {
			badgeData += resData;
		});

		dirRes.on("end", function () {
			var tags = JSON.parse(badgeData).data;
			var b; var out="<!DOCTYPE html>"+
				"<html>"+
				"<head>"+
				"<style type='text/css'>"+
				"body, html {font-family:sans-serif; width:60%; margin:auto; text-align:center; color:#333333;}"+
				"a {text-decoration:none; font-weight:bold; background:#b4ddf3; padding:3px; margin:3px; border-radius:3px; display:inline-block;}"+
				"a:link {color:#fc9141;}"+
				"a:visited {color:#279ddd;}"+
				"h1 {color:#ed1922;}"+
				"div.badges {padding:3%; margin:2%; border:1px dotted #666666;}"+
				"div.info {clear:both; padding:5%;}"+
				"</style>"+
				"</head>"+
				"<body>"+
				"<h1>TAGS</h1>";
			out+="<div class='badges'>";
			for(b=0; b<tags.length; b++){
				out+="<a href='badge-search?tag="+tags[b].tag+"'>"+tags[b].tag+"</a>";
			}
			out+="<div class='info'>Choose a tag to see badges!</div></div>";
			out+="</body></html>";

			res.send(out);
		});
	});
	
	
});
{% endhighlight %}

When the user clicks one of the tags, we take them to the "badge-search" page, in which we use the `/search` endpoint to display badges relevant to the tag they picked:

{% highlight js %}
app.get('/badge-search', function(req, res){
  //retrieve the badge tag parameter and build into search
	http.get('http://directory.openbadges.org/search?tags='+req.param('tag'), function(dirRes) {
		var badgeData = "";

		dirRes.on("data", function (resData) {
			badgeData += resData;
		});

		dirRes.on("end", function () {
			var badges = JSON.parse(badgeData).data;
			var b; var out="<!DOCTYPE html>"+
				"<html>"+
				"<head>"+
				"<style type='text/css'>"+
				"body, html {font-family:sans-serif; width:60%; margin:auto; text-align:center; color:#333333;}"+
				"a:link {text-decoration:none; font-weight:bold; color:#fc9141;}"+
				"h1 {color:#ed1922;}"+
				"h2 {color:#279ddd;}"+
				"div {padding:3%; margin:2%; border:1px dotted #666666;}"+
				"</style>"+
				"</head>"+
				"<body>"+
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

Again, this results in the same output we built in <a href="search-for-badges">Search For Badges</a>, but with the badge tag retrieved from the passed parameter originally defined in our HTML tag link (received from the `/tags` endpoint).

## Conclusion

As you have seen in the simple example pages above, you can combine the Open Badges Directory `/tags` endpoint with the `/search` endpoint to create an interactive directory interface for your users, allowing them to find badges on the subjects or activity types they are interested in. 

If you have an existing badge issuing site, this could mean linking earners to badges on similar topics to badges they have already earned.

To learn more about the badge class structure, see the [Specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass).

For the other Directory endpoints, see <a href="directory-api">Retrieve Badges</a>.
