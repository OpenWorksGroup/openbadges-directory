---
layout: site
---

# Add Your Badges

<a name="how-does-it-work" /></a>
## How Does it Work?

When you register your badge list, it will be indexed, then reindexed every 24 hours. ___This means that if you add or remove badges from the list at your registered endpoint, the Directory will update to reflect that.___

Each time a badge list is registered, the Directory support email receives notification, so any problems will be identified and addressed. Any invalid badges will be indexed but will not be returned from the API endpoints.

---------------------------------------

<a name="instructions" /></a>
## Instructions

At the moment the Directory only indexes badge classes. To have your badges added, you need a URL at which the badge class locations are listed in a JSON array. _Depending on your site or application, this could be achieved programmatically or simply by creating a file._ 

Your badge class list endpoint should return a JSON message with the following simple structure:

{% highlight json %}
{
    "badgelist": [
    {
        "location": "http://issuersite.com/location-of-badge"
    }, {
        "location": "http://issuersite.com/location-of-other-badge"
    }
    ]
}
{% endhighlight %}

Include an entry for the location of each badge class JSON file you want the Directory to index - these badges will become discoverable via the [Directory API](directory-api).

___If you're new to badge classes, each one describes what a single available Open Badge represents - see the [specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass) and [assertion guide](https://github.com/mozilla/openbadges/wiki/Assertion-Information-for-the-Uninitiated) for more.___

When the Directory retrieves a badge listing, it collects up all of the locations and follows them to their badge class definitions. 

For instance, let's say you are a badge issuer called badgetastic and your website is `http://badgetastic.com`. To participate in the Directory, you would expose an endpoint somewhere (_on your site or otherwise_) that lists all of the badgetastic badges you want indexed. The URL is up to you, but assuming you host it on your site and expose the endpoint at `http://badgetastic.com/badgelist` - hitting that url we would expect to see a listing of badge locations included in a `badgelist` array as in the above example. Each of these locations would be expected to lead to a valid JSON badge class.

Let's look at an individual entry from a `badgelist` array:

{% highlight json %}
"location": "http://badgetastic.com/badge1"
{% endhighlight %}
 
The Directory would expect to find a valid badge class JSON listing at the specified location, e.g.:

{% highlight json %}
{
    "name": "Badge 1!",
    "description": "You speak computers and you can use them too.",
    "image": "http://badgetastic.com/badge1.svg",
    "criteria": "http://badgetastic.com/badge1-criteria",
    "issuer": "http://badgetastic.com",
    "tags": [
        "Skill",
        "Doer",
        "Realistic"
        ]
}
{% endhighlight %}

For more guidance on creating your badge list (including BadgeKit users), see [The Badge List Endpoint](badgelist-endpoint).

---------------------------------------

<a name="registration-form" /></a>
## Registration Form

When you have your badge class listing ready, copy the URL into the below form, together with your other details.

___If you'd prefer to register via the API, see [Register Using the API](register-via-api).___

{% include registration-form.html %}

---------------------------------------

