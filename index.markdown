---
layout: site
---

The Directory is a prototype of an un-opinionated storage and retrieval system for <a href="http://openbadges.org" target="_blank">Open Badges</a> and an open source community project of the <a href="http://wiki.badgealliance.org/index.php/Directory_Working_Group" target="_blank">Directory Working Group</a> in coordination with the <a href="http://badgealliance.org/" target="_blank">Badge Alliance</a>. 

* To use the Directory API, see the [Retrieve Badges](directory-api) page.
* To have your badges added to the Directory, see [Add Your Badges](#addbadges) below.
* For related information, see these sections below:
    * [Who is the Directory for?](#who-is-the-directory-for)
    * [How Does it Work?](#how-does-it-work)
    * [Approach](#approach)
    * [Additional Resources](#resources)
    * [Help and Support](#help)

<a name="addbadges" /></a>
## Add Your Badges

At the moment the Directory only indexes badge classes. To have yours indexed, you need a URL at which the badge class locations are listed in a JSON array. _Depending on your site or application, this could be achieved programmatically or simply by creating a file._ 

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

___If you're new to badge classes, see the [specification](https://github.com/mozilla/openbadges-specification/blob/master/Assertion/latest.md#badgeclass) and [assertion guide](https://github.com/mozilla/openbadges/wiki/Assertion-Information-for-the-Uninitiated).___

When the Directory retrieves a badge listing, it collects up all of the locations and follows them to their badge class definitions. For instance, let's say you are a badge issuer called badgetastic and your website is http://badgetastic.com. To participate in the Directory, you would be expected to expose an endpoint somewhere (on your site or otherwise) that lists all of the badges you want indexed from badgetastic. The URL is up to you, but assuming you host it on your site and expose the endpoint at http://badgetastic.com/badgelist - hitting that url we would expect to see a listing of badge locations included in a `badgelist` array as in the above example. Each of these locations would be expected to lead to a valid badge class.

{% highlight json %}
"location": "http://badgetastic.com/badge1"
{% endhighlight %}
 
Given the above value in the `badgelist` array, the Directory would expect to find a valid badge class JSON listing at http://badgetastic.com/badge1:

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

When you have your badge class listing ready, copy the URL into the below form, together with your other details.

___If you'd prefer to register via the API, see [Register Using the API](register-via-api).___

{% include registration-form.html %}

---------------------------------------

<a name="who-is-the-directory-for" /></a>
## Who is the Directory for?

The Directory is a community resource. Any issuer of Open Badges can register to have them indexed. The API endpoints can be used:

* in third-party apps
    * _offering users the ability to search for and browse badges_
* to integrate into existing apps
    * _for example issuer sites offering earners similar badges_
* for research

The Directory comprises a search engine for badge classes, so if you're an issuer it provides opportunities for people and organizations to find your badges. Client applications using the Directory API can create pathways to opportunity for badge earners.

<a name="how-does-it-work" /></a>
## How Does it Work?

When you register your badge list, it will be indexed and reindexed every 24 hours. This means that if you add or remove badges from the list at your registered endpoint, the Directory will update to reflect that.

Each time a badge list is registered, the Directory support email receives notification, so any problems will be identified and addressed. Any invalid badges will be indexed but will not be returned from the API endpoints.

<a name="approach" /></a>
## Approach So Far (+ Future)

This API is a prototype to integrate with the initial version of [openbadges-discovery](https://github.com/mozilla/openbadges-discovery),
and to serve as a starting point for an actual badge Directory API for the general badge community/ecosystem.

The prototype is hosted on a free Heroku instance.

There are lots of questions (and discussions) surrounding how a directory would best work, and what it would be implemented on.

* In terms of crawling and indexing badges:
    * [https://github.com/mozilla/openbadges-discussion/issues/1 - badge indexing](https://github.com/mozilla/openbadges-discussion/issues/1)
* In terms of extending badges (and what impact that may have on searching and retrieving):
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

<a name="help"></a>
## Help and Support

* Post general questions in the [Community Google Group](http://bit.ly/OBIGeneral) and post technical questions in our [Dev Google Group](http://bit.ly/OBIDev). 
* Reach members of the Open Badges team directly on IRC (irc.mozilla.org) in the #badges channel. 
* Email questions directly to <a href"mailto:badges@mozillafoundation.org">badges@mozillafoundation.org</a> and a member of the team will follow-up.
* Follow or tweet [@OpenBadges](https://twitter.com/OpenBadges) and [@BadgeAlliance](https://twitter.com/badgealliance).
* Get involved or submit issues via the [GitHub repo](https://github.com/mozilla/openbadges-directory).

### License

[MPL 2.0](http://www.mozilla.org/MPL/2.0/)

