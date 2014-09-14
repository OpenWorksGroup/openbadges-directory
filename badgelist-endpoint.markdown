---
layout: site
---

# The Badge List Endpoint

To have your badges indexed for inclusion in the Directory, you need to expose a list of badge class locations at the URL you register. This list should be JSON-formatted as we will see below. How you create the JSON list is entirely up to you, as long as the URL responds with it when the Directory indexes (and regularly reindexes) it.

* [BadgeKit Users](#badgekit)
* [Creating your Badge List](#creating)
	* [PHP Example](#php-example)
* [Registering](#register)

<a name="badgekit"></a>
## BadgeKit Users

If you have an account on the Mozilla-hosted instance of BadgeKit at [http://badgekit.org](http://badgekit.org), your public badges will be automatically indexed by the Directory.

If you're hosting your own instance of BadgeKit, your badge list will be automatically created at a predefined location. The location is the URL for your BadgeKit API, followed by `/public/badges`, for example:

{% highlight text %}
http://yourapilocation.com/public/badges
{% endhighlight %}

You can check this by visiting the URL in your browser - you should see your badge class locations listed in the following structure:

{% highlight json %}
{
    "badgelist": [
    {
        "location": "http://issuersite.com/location-of-badge"
    }, {
        "location": "http://issuersite.com/location-of-other-badge"
    },
    ...
    ]
}
{% endhighlight %}

This should work automatically as long as your BadgeKit API instance is up to date with the code from the GitHub repo: [https://github.com/mozilla/badgekit-api](https://github.com/mozilla/badgekit-api)

<a name="creating"></a>
## Creating your Badge List

If you have your own badge issuing site or application and want to register your badges for indexing by the Directory, you will need to create an endpoint at which your badge class locations are listed in the above structure.

___To issue Open Badges within the OBI, you need a badge class JSON file for each badge you issue, hosted at a stable location - if you're just getting started, see [New Issuers: Give Yourself a Badge](https://github.com/mozilla/openbadges/wiki/New-Issuers:-Give-Yourself-a-Badge).___

<a name="php-example"></a>
### PHP Example

Let's look at how you might create your badge list in a PHP site with the badge class data stored in a MySQL database.

Say your database included a table named `badges`, in which the `badgeclass` field included the URL of the badge class JSON - this is the value you would include for each badge in your list.

Your code could query the database and build the JSON badge list using something like the following approach:

{% highlight php %}
<?php
//include your hostname, username, password and database name
$conn=mysqli_connect("host", "user", "pwd", "dbname");

//query the table with the badge class locations in it
$result = mysqli_query($conn, "SELECT * from badges");

//send json
header('Content-Type: application/json');

//start to write the JSON
echo '{ "badgelist":[';

//iterate through the badges
$first = true;
while($row=mysqli_fetch_array($result)){
	if($first) {
		$first = false;
	} else {
		echo ',';
	}
	//write the badge class location out
	echo '{ "location": "'.$row['badgeclass'].'" }';
}
echo ']}';

mysqli_close($db);
?>
{% endhighlight %}

When you have your script prepared, visit it in the browser to ensure that it writes out the correct structure (as above). Then you can register the location your script is running at to have your badge classes indexed by the Directory.

<a name="register"></a>
## Registering

Once you have your badge list URL ready, you can register it along with your other details at [http://directory.openbadges.org](http://directory.openbadges.org).

The Directory will reindex your badge list every 24 hours. This means that the Directory data will update with any changes you make to the badge classes in your list, for example by adding or removing badges.
