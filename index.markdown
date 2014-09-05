---
layout: site
---

The directory is a prototype of an un-opinionated storage and retrieval system for <a href="http://openbadges.org" target="_blank">Open Badges</a> and an open source community project of the <a href="http://wiki.badgealliance.org/index.php/Directory_Working_Group" target="_blank">Directory Working Group</a> in coordination with the <a href="http://badgealliance.org/" target="_blank">Badge Alliance</a>. 

* To use the directory API, see the [Retrieve Badges](directory-api) page.
* To have your badges added to the directory, see [Add Your Badges](#addbadges) below.
* For related information, see [Approach](#approach) and [Additional Resources](#resources) below.

<a name="addbadges" /></a>
## Add Your Badges

At the moment the directory only indexes badge classes. To have yours indexed, you need a URL at which the badge class locations are listed in a JSON array. _Depending on your site or application, this could be achieved programmatically or simply by creating a file._ 

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

Include an entry for the location of each badge class JSON file you want the directory to index - these badges will become discoverable via the [directory API](directory-api).

When the directory retrieves a badge listing, it collects up all of the locations and follows them to their badge class definitions. For instance, let's say you are a badge issuer called badgetastic and your website is http://badgetastic.com. To participate in the directory, you would be expected to expose an endpoint somewhere (on your site or otherwise) that lists all of the badges you want indexed from badgetastic. The URL is up to you, but assuming you host it on your site and expose the endpoint at http://badgetastic.com/badgelist - hitting that url we would expect to see a listing of badge locations included in a `badgelist` array as in the above example. Each of these locations would be expected to lead to a valid badge class.

{% highlight json %}
"location": "http://badgetastic.com/badge1"
{% endhighlight %}
 
Given the above value in the `badgelist` array, the directory would expect to find a valid badge class JSON listing at http://badgetastic.com/badge1:

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

When you have your badge class listing ready, copy the URL into the below form, together with your other details.

{% include registration-form.html %}

---------------------------------------

<a name="approach" /></a>
## Approach So Far (+ Future)

This API is a prototype to integrate with the initial version of [openbadges-discovery](https://github.com/mozilla/openbadges-discovery),
and to serve as a starting point for an actual badge directory API for the general badge community/ecosystem.

There are lots of questions (and discussions) surrounding how a directory would best work, and what it would be implemented on.

In terms of crawling and indexing badges:
* [https://github.com/mozilla/openbadges-discussion/issues/1 - badge indexing](https://github.com/mozilla/openbadges-discussion/issues/1)

In terms of extending badges (and what impact that may have on searching and retrieving):

* [https://github.com/mozilla/openbadges-discussion/issues/8 - badge class extensions](https://github.com/mozilla/openbadges-discussion/issues/8 )
* [https://github.com/mozilla/openbadges-directory/issues/3](https://github.com/mozilla/openbadges-directory/issues/3)
* [https://github.com/mozilla/openbadges-directory/issues/6](https://github.com/mozilla/openbadges-directory/issues/6)
* [https://github.com/mozilla/openbadges-badgekit/issues/91  - location info for badges/badge classes](https://github.com/mozilla/openbadges-badgekit/issues/91)


<a name="resources" /></a>
## Additional Resources

* [Open Badges](http://openbadges.org)
* [Badge Alliance](http://badgealliance.org/)
* [Directory Working Group](http://wiki.badgealliance.org/index.php/Directory_Working_Group)
* [Open Badges Directory on Github](https://github.com/mozilla/openbadges-directory)

### License

[MPL 2.0](http://www.mozilla.org/MPL/2.0/)

