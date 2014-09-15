---
layout: site
---

# Register Using the API

You can register to have your badge list indexed by the Directory using the [registration form](index#addbadges). If you're prefer to use the API, you can do so as follows.

## Registration Endpoint

The registration endpoint in the Directory API is `/register`:

{% highlight text %}
http://directory.openbadges.org/register
{% endhighlight %}

## Badge List

To have your badges indexed by the Directory, you must have a badge list endpoint prepared - this should return a JSON response including each of your badge class locations in an array. See [The Badge List Endpoint](badgelist-endpoint) for details.

## Post Data

To register via the API endpoint, you need to supply your registration information via a `POST` request. The parameters are as follows:

| &nbsp;__Parameter__&nbsp; | &nbsp;__Status__&nbsp; | &nbsp;__Description__&nbsp; |
| :------------ | :------- | :-------------- |
| &nbsp;`endpoint`&nbsp; | &nbsp;REQUIRED&nbsp; | &nbsp;The URL of your JSON badge list&nbsp; |
| &nbsp;`name`&nbsp; | &nbsp;REQUIRED&nbsp; | &nbsp;Your name&nbsp; |
| &nbsp;`website`&nbsp; | &nbsp;REQUIRED&nbsp; | &nbsp;The URL of your website&nbsp; |
| &nbsp;`email`&nbsp; | &nbsp;REQUIRED&nbsp; | &nbsp;Your contact email address&nbsp; |
| &nbsp;`description`&nbsp; | &nbsp;_OPTIONAL_&nbsp; | &nbsp;Overview of you and your purpose in using the Directory&nbsp; |
| &nbsp;`organization`&nbsp; | &nbsp;_OPTIONAL_&nbsp; | &nbsp;Your organization name&nbsp; |

___All parameters are strings.___

## Expected Request

{% highlight json %}
{
  "endpoint": "http://issuersite.com/badgelist",
  "name": "Badge Issuer",
  "website": "http://issuersite.com",
  "email": "admin@issuersite.com",
  "description": "We love issuing badges.",
  "organization": "Issuer Organization"
}
{% endhighlight %}

## Expected Response

If your badge list details were successfully received:

{% highlight json %}
{
  "data": { "success": true }
}
{% endhighlight %}

You should also receive a confirmation email regarding your registration.

If there was an error processing your registration details:

{% highlight json %}
{
  "status": "validation failed",
  "errors": {
    "email": {
      "code": "MISSING",
      "field": "email",
      "message": "Field is required"
    }
  }
}
{% endhighlight %}
