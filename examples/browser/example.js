'use strict';

var client       = require('./client'),
    BadgeClass   = client.BadgeClass,
    BadgeClasses = client.BadgeClasses;

new BadgeClass({ url: 'http://localhost:3000' }).fetch();
new BadgeClasses({ url: 'http://localhost:3000' }).fetch();