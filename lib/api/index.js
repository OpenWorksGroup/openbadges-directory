var restify    = require('restify'),
    mysql      = require('mysql'),
    logger     = require('../logger'),
    util       = require('../util'),
    search     = require('../search'),
    config     = require('../config'),
    connection = mysql.createConnection(config('DATABASE_URL'));

module.exports = {
  search: function (req, res, next) {
    if (!Object.keys(req.query).length) {
      return next(new restify.BadRequestError('You must specify arguments to execute a search'));
    }

    var searchParams = util.parseSearch(req);
    search.search(searchParams, function (err, results) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      res.send({ data: results });
    });
  },

  recent: function (req, res, next) {
    var recentParams = util.parseRecent(req);
    search.search(recentParams, function (err, results) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      res.send({ data: results });
    });
  },

  get: function (req, res, next) {
    search.get(req.params.location, function (err, result) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      if (!result) {
        return next(new restify.NotFoundError());
      }
      res.send({ data: result });
    });
  },

  tags: function (req, res, next) {
    var searchParams = util.parseSearch(req);
    search.tags(searchParams, function (err, result) {
      if (err) {
        return next(new restify.InternalServerError(err.message));
      }
      return res.send({ data: result });
    });
  },

  register: function (req, res, next) {
    connection.query('INSERT INTO endpoints SET ?',
    {
      name: req.body.name,                       //name (required)
      organization: req.body.organization || '', //organization
      description: req.body.description || '',   //website (required)
      website: req.body.website,                 //email (required)
      contact_email: req.body.email,             //endpoint (required)
      endpoint: req.body.endpoint                //
    },
    function (err) {
      if (err) {
        logger.error(err.message);
        return next(new restify.InternalServerError('There was a problem registering your information.'));
      }
      var mail = require('../mail');
      mail.transport.sendMail({
        from: 'OpenBadges Directory <directory-support@badgealliance.org>',
        to: req.body.email,
        subject: 'Thank you for registering with the OpenBadges Directory',
        text: 'Your registration has been received, and we will start indexing your badge class content.',
        html: 'Your registration has been received, and we will start indexing your badge class content. <br/><br/>' +
          '<strong>Endpoint</strong>: ' + req.body.endpoint + '<br/>' +
          '<strong>Name</strong>: ' + req.body.name + '<br/>' +
          '<strong>Organization</strong>: ' + req.body.organization + '<br/>' +
          '<strong>Website</strong>: ' + req.body.website + '<br/>' +
          '<strong>Description</strong>: ' + req.body.description + '<br/>' +
          '<strong>Email</strong>: ' + req.body.email + ''
          
      }, function (err) {
        if (err) { console.log(err); }
      });
      
      mail.transport.sendMail({
        from: 'OpenBadges Directory <directory-support@badgealliance.org>',
        to: 'OpenBadges Directory <directory-support@badgealliance.org>',
        subject: 'OpenBadges Directory Endpoint Registered',
        text: 'Endpoint: ' + req.body.endpoint +
        'Name: ' + req.body.name +
        'Organization: ' + req.body.organization +
        'Website: ' + req.body.website +
        'Description: ' + req.body.description +
        'Email: ' + req.body.email +'',
        html: '<strong>Endpoint</strong>: ' + req.body.endpoint + '<br/>' +
          '<strong>Name</strong>: ' + req.body.name + '<br/>' +
          '<strong>Website</strong>: ' + req.body.website + '<br/>' +
          '<strong>Description</strong>: ' + req.body.description + '<br/>' +
          '<strong>Email</strong>: ' + req.body.email + '<br/>' +
          '<strong>Organization</strong>: ' + req.body.organization + ''
      }, function (err) {
        if (err) { console.log(err); }
      });

      return res.send({ data: { success: true }})
    });
  },

  fakeIssuer: function (req, res, next) {
    return res.send({
      name: 'Directory Fake Issuer'
    });
  }
};