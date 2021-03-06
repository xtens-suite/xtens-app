/* jshint node: true */
/* jshint mocha: true */
/* globals _, sails, Operator, Passport */
/**
 * @modified by Massimiliano Izzo
 * for more details see: https://github.com/tarlepp/angular-sailsjs-boilerplate/blob/master/backend/api/services/Passport.js
 */

let path     = require('path');
let url      = require('url');
let PassportService = require('passport');
let BluebirdPromise = require('bluebird');
let Joi = require("joi");
const ValidationError = require('xtens-utils').Errors.ValidationError;
/**
 * Passport Service
 *
 * A painless Passport.js service for your Sails app that is guaranteed to
 * Rock Your Socks™. It takes all the hassle out of setting up Passport.js by
 * encapsulating all the boring stuff in two functions:
 *
 *   PassportService.endpoint()
 *   PassportService.callback()
 *
 * The former sets up an endpoint (/auth/:provider) for redirecting a user to a
 * third-party provider for authentication, while the latter sets up a callback
 * endpoint (/auth/:provider/callback) for receiving the response from the
 * third-party provider. All you have to do is define in the configuration which
 * third-party providers you'd like to support. It's that easy!
 *
 * Behind the scenes, the service stores all the data it needs within "Pass-
 * ports". These contain all the information required to associate a local user
 * with a profile from a third-party provider. This even holds true for the good
 * ol' password authentication scheme – the Authentication Service takes care of
 * encrypting passwords and storing them in Passports, allowing you to keep your
 * User model free of bloat.
 */

// Load authentication protocols
PassportService.protocols = require('./protocols');

/**
 * Connect a third-party profile to a local user
 *
 * This is where most of the magic happens when a user is authenticating with a
 * third-party provider. What it does, is the following:
 *
 *   1. Given a provider and an identifier, find a matching Passport.
 *   2. From here, the logic branches into two paths.
 *
 *     - A user is not currently logged in:
 *       1. If a Passport wasn't found, create a new user as well as a new
 *          Passport that will be assigned to the user.
 *       2. If a Passport was found, get the user associated with the passport.
 *
 *     - A user is currently logged in:
 *       1. If a Passport wasn't found, create a new Passport and associate it
 *          with the already logged in user (ie. "Connect")
 *       2. If a Passport was found, nothing needs to happen.
 *
 * As you can see, this function handles both "authentication" and "authori-
 * zation" at the same time. This is due to the fact that we pass in
 * `passReqToCallback: true` when loading the strategies, allowing us to look
 * for an existing session in the request and taking action based on that.
 *
 * For more information on auth(entication|rization) in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 * http://passportjs.org/guide/authorize/
 *
 * @param {Object}   req
 * @param {Object}   query
 * @param {Object}   profile
 * @param {Function} next
 */
PassportService.connect = function (req, query, profile, next) {
    sails.log.verbose(__filename + ':' + '__line' + ' [Service.Passport.connect() called]');

    let user = {};
    // , provider;

    // Get the authentication provider from the query.
    query.provider = req.param('provider');

    // Use profile.provider or fallback to the query.provider if it is undefined
    // as is the case for OpenID, for example
    let provider = profile.provider || query.provider;

    // If the provider cannot be identified we cannot match it to a passport so
    // throw an error and let whoever's next in line take care of it.
    /* comment out (see https://github.com/tarlepp/angular-sailsjs-boilerplate/blob/master/backend/api/services/Passport.js)
       if (!provider){
       return next(new Error('No authentication provider was identified.'));
       } */

    // If the profile object contains a list of emails, grab the first one and
    // add it to the user.
    if (profile.hasOwnProperty('emails')) {
        user.email = profile.emails[0].value;
    }
    // If the profile object contains a username, add it to the user.
    if (profile.hasOwnProperty('username')) {
        user.username = profile.username;
    }

    // If neither an email or a username was available in the profile, we don't
    // have a way of identifying the user in the future. Throw an error and let
    // whoever's next in the line take care of it.
    // if (!user.username && !user.email) { // changed to line under (by Massi)
    if (!Object.keys(user).length) {
        return next(new Error('Neither a username nor email was available'));
    }

    Passport.findOne({
        provider   : provider,
        identifier : query.identifier.toString()
    }, function (err, passport) {
        // console.log(passport);
        /* istanbul ignore if */
        if (err) {
            return next(err);
        }

        if (!req.user) {
            // Scenario: A new user is attempting to sign up using a third-party authentication provider.
            // Action:   Create a new user and assign them a passport. (Apparently this is not allowed in our scenario
            if (!passport) {

                return next("user not found");
                /*
                   User.create(user, function (err, user) {
                   if (err) {
                   if (err.code === 'E_VALIDATION') {
                   if (err.invalidAttributes.email) {
                   req.flash('error', 'Error.Passport.Email.Exists');
                   }
                   else {
                   req.flash('error', 'Error.Passport.User.Exists');
                   }
                   }

                   return next(err);
                   }

                   query.user = user.id;

                   Passport.create(query, function (err, passport) {
                // If a passport wasn't created, bail out
                if (err) {
                return next(err);
                }

                next(err, user);
                });
                });
                */
            }
            // Scenario: An existing user is trying to log in using an already connected passport.
            // Action:   Get the user associated with the passport.
            else {
                // If the tokens have changed since the last session, update them
                if (query.hasOwnProperty('tokens') && query.tokens !== passport.tokens) {
                    passport.tokens = query.tokens;
                }

                // Save any updates to the Passport before moving on
                Passport.update({id: passport.id}, passport,function (err, passport) {
                  /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }

                    // Fetch the user associated with the Passport
                    Operator.findOne({id: passport[0].user}, function (err,operator) {
                      /* istanbul ignore if */
                        if (err) {
                            return next(err);
                        }
                        next(null, operator);
                    });
                });
            }
        } else {
            // Scenario: A user is currently logged in and trying to connect a new passport.
            // Action:   Create and assign a new passport to the user.
            if (!passport) {
                query.user = req.user.id;

                Passport.create(query, function (err, passport) {
                    // If a passport wasn't created, bail out
                    /* istanbul ignore if */
                    if (err) {
                        return next(err);
                    }

                    next(null, req.user);
                });
            }
            // Scenario: The user is a nutjob or spammed the back-button.
            // Action:   Simply pass along the already established session.
            else {
                next(null, req.user);
            }
        }
    });
};


PassportService.validate = (req) => {
    let params = req.allParams();

    const loginSchema = {
        identifier:Joi.string().required(),
        password:Joi.string().required()
    };

    return Joi.validate(params, loginSchema);
};

PassportService.isStrongPassword = (password) => {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (!strongRegex.test(password)) {
        return false;
    }
    return true;
};
/**
 * Create an authentication endpoint
 *
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 *
 * @param  {Object} req
 * @param  {Object} res
 */
PassportService.endpoint = function (req, res) {
    console.log("Service.Passport.endpoint() called");
    sails.log.verbose(__filename + ':' + __line + ' [Service.Passport.endpoint() called]');

    let strategies = sails.config.passport,
        provider   = req.param('provider'),
        options    = {};
    console.log(strategies,strategies.hasOwnProperty(provider));
    // If a provider doesn't exist for this endpoint, send the user back to the
    // login page
    if (!strategies.hasOwnProperty(provider)) {
        return res.json(401, 'Unknown auth provider');
    }

    // Attach scope if it has been set in the config
    if (strategies[provider].hasOwnProperty('scope')) {
        options.scope = strategies[provider].scope;
    }

    // Load authentication strategies
    // (added by Massi: see https://github.com/tarlepp/angular-sailsjs-boilerplate/blob/master/backend/api/services/Passport.js )
    this.loadStrategies(req);

    // Redirect the user to the provider for authentication. When complete,
    // the provider will redirect the user back to the application at
    //     /auth/:provider/callback
    this.authenticate(provider, options)(req, res, req.next);
};

/**
 * Create an authentication callback endpoint
 *
 * For more information on authentication in Passport.js, check out:
 * http://passportjs.org/guide/authenticate/
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
PassportService.callback = function (req, res, next) {
    console.log("Service.Passport.callback() called");
    sails.log.verbose(__filename + ':' + __line + ' [Service.Passport.callback() called]');

    let provider = req.param('provider', 'local'),
        action   = req.param('action');

    // Passport.js wasn't really built for local user registration, but it's nice
    // having it tied into everything else.
    if (provider === 'local' && action !== undefined) {
        if (action === 'register' && !req.user) {
            this.protocols.local.register(req, res, next);
        }
        else if (action === 'connect' && req.user) {
            this.protocols.local.connect(req, res, next);
        }
        else if (action === 'disconnect' && req.user) {
            this.disconnect(req, res, next);
        }
        else {
            next(new Error('Invalid action'));
        }
    } else {
        if (action === 'disconnect' && req.user) {
            this.disconnect(req, res, next) ;
        }
        else {
            // The provider will redirect the user to this URL after approval. Finish
            // the authentication process by attempting to obtain an access token. If
            // access was granted, the user will be logged in. Otherwise, authentication
            // has failed.
            const validationParams = PassportService.validate(req);
            if(validationParams.error){
                let err = new ValidationError(validationParams.error);
                err.code = 400;
                return next(err, false);
            }
            this.authenticate(provider, next)(req, res, req.next);
        }
    }
};

/**
 * Load all strategies defined in the Passport configuration
 *
 * For example, we could add this to our config to use the GitHub strategy
 * with permission to access a users email address (even if it's marked as
 * private) as well as permission to add and update a user's Gists:
 *
github: {
name: 'GitHub',
protocol: 'oauth2',
strategy: require('passport-github').Strategy
scope: [ 'user', 'gist' ]
options: {
clientID: 'CLIENT_ID',
clientSecret: 'CLIENT_SECRET'
}
}
 *
 * For more information on the providers supported by Passport.js, check out:
 * http://passportjs.org/guide/providers/
 *
 */
PassportService.loadStrategies = function () {
    console.log("Service.Passport.loadStrategies() called");
    sails.log.verbose(__filename + ':' + __line + ' [Service.Passport.loadStrategies() called]');

    let that = this, strategies = sails.config.passport;

    Object.keys(strategies).forEach(function(key) {
        let options = { passReqToCallback: true }, Strategy;

        if (key === 'local') {
            // Since we need to allow users to login using both usernames as well as
            // emails, we'll set the username field to something more generic.
            _.extend(options, { usernameField: 'identifier' });

            // Let users override the username and passwordField from the options (commented out by Massi)
            // _.extend(options, strategies[key].options || {});

            // disable sessions on local strategy (added by Massi)
            _.extend(options, {session: false});

            // Only load the local strategy if it's enabled in the config
            if (strategies.local) {
                Strategy = strategies[key].strategy;

                that.use(new Strategy(options, that.protocols.local.login));
            }
        }
        // Bearer strategy commented out (by Massi) -
        // see https://github.com/tarlepp/angular-sailsjs-boilerplate/blob/master/backend/api/services/Passport.js

        else if (key === 'bearer') {

            if (strategies.bearer) {
                Strategy = strategies[key].strategy;
                that.use(new Strategy(that.protocols.bearer.authorize));
            }

        }
        else {
            let protocol = strategies[key].protocol,
                callback = strategies[key].callback;

            if (!callback) {
                // modified by Massi
                // callback = 'auth/' + key + '/callback';
                callback = path.join('auth', key, 'callback');
            }

            Strategy = strategies[key].strategy;

            let baseUrl = sails.getBaseurl();

            switch (protocol) {
                case 'oauth':
                case 'oauth2':
                    options.callbackURL = url.resolve(baseUrl, callback);
                    break;

                case 'openid':
                    options.returnURL = url.resolve(baseUrl, callback);
                    options.realm     = baseUrl;
                    options.profile   = true;
                    break;
            }

            // Merge the default options with any options defined in the config. All
            // defaults can be overriden, but I don't see a reason why you'd want to
            // do that.
            _.extend(options, strategies[key].options);

            that.use(new Strategy(options, that.protocols[protocol]));
        }
    });
};

/**
 * Disconnect a passport from a user
 *
 * @param  {Object} req
 * @param  {Object} res
 */
PassportService.disconnect = function (req, res, next) {
    let user     = req.user,
        provider = req.param('provider', 'local'),
        query    = {};

    query.user = user.id;
    query[provider === 'local' ? 'protocol' : 'provider'] = provider;

    Passport.findOne(query, function (err, passport) {
      /* istanbul ignore if */
        if (err) {
            return next(err);
        }

        Passport.destroy(passport.id, function (error) {
          /* istanbul ignore if */
            if (err) {
                return next(err);
            }

            next(null, user);
        });
    });
};

PassportService.serializeUser(function (user, next) {
    // modified by Massi
    // next(null, user.id);

    sails.log.verbose(__filename + ':' + __line + ' [Service.Passport.serializeUser() called]');
    if (!user) {
        let err = new Error('Invalid user');
        next(err, null);
    } else {
        next(null, user.id);
    }
});

PassportService.deserializeUser(function (id, next) {
    sails.log.verbose(__filename + ':' + __line + ' [Service.Passport.deserializeUser() called]');
    Operator.findOne(id, next);
});

module.exports = BluebirdPromise.promisifyAll(PassportService);
