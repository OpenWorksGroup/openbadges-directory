---
layout: site
---

# The Badge List Endpoint

To have your badges indexed for inclusion in the Directory, you need to expose a list of badge class locations at the URL you register. This list should be JSON-formatted as we will see below. How you create the JSON list is entirely up to you, as long as the URL responds with it when the Directory indexes (and regularly reindexes) it.

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

## Creating your Badge List

If you have your own badge issuing site or application and want to register your badges for indexing by the Directory, you will need to create an endpoint at which your badge class locations are listed in the above structure.

_more guidance coming soon_

Once you have your badge list URL ready, you can register it along with your other details at [http://directory.openbadges.org](http://directory.openbadges.org).
