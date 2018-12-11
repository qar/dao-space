const OAuth = require(`${__base}/lib/oauth/lib/oauth`).OAuth;
const fs = require('fs');
const crypto = require('crypto');
const urlParser = require('url');
const  authMiddleWare = require('../middlewares/auth');
const config = require(`${__base}/config`);
const UserProxy = require(`${__base}/proxy`).User;
const Models = require('../models');
const  User = Models.User;

const BASE_URL = config.base_url;
const OAUTH_BASE_URL = config.oauth_base_url;
const JIRA_SITE_URL = config.jira_site_url;
const OAUTH_CONSUMER_KEY = config.oauth_consumer_key;
const APP_SESSION_ID = config.app_session_id;
const APP_COOKIE_ID = config.app_cookie_id;

function jiraAuth(req, res) {
  const oAuthConfig = [
    OAUTH_BASE_URL + '/plugins/servlet/oauth/request-token',
    OAUTH_BASE_URL + '/plugins/servlet/oauth/access-token',
    OAUTH_CONSUMER_KEY,
    fs.readFileSync('./jira.pem', 'utf8'),
    '1.0', // OAuth Version
    `${BASE_URL}/jira-callback`,
    'RSA-SHA1' // OAuth Version
  ];

  const oa = new OAuth(...oAuthConfig);

  oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
    if (error) {
      res.status(error.statusCode);
      res.send(error.data);
    } else {
      req.session.oa = oa;
      req.session.oauth_token = oauthToken;
      req.session.oauth_token_secret = oauthTokenSecret;
      req.session.save(function(err) {
        return res.redirect(OAUTH_BASE_URL + "/plugins/servlet/oauth/authorize?oauth_token=" + oauthToken);
      });
    }
  });
}

function jiraCallback(req, res) {
  const session = req.cookies[APP_SESSION_ID];

  const oa = new OAuth(req.session.oa._requestUrl,
    req.session.oa._accessUrl,
    req.session.oa._consumerKey,
    fs.readFileSync('./jira.pem', 'utf8'),
    req.session.oa._version,
    req.session.oa._authorize_callback,
    req.session.oa._signatureMethod);

  oa.getOAuthAccessToken(
    req.session.oauth_token,
    req.session.oauth_token_secret,
    req.param('oauth_verifier'),
    function(error, oauth_access_token, oauth_access_token_secret, results2) {
      if (error) {
        console.log('error');
        console.log(error);
        res.redirect('/');
      } else {
        // store the access token in the session
        req.session.oauth_access_token = oauth_access_token;
        req.session.oauth_access_token_secret = oauth_access_token_secret;

        oa.get(`${OAUTH_BASE_URL}/rest/api/2/myself`,
          req.session.oauth_access_token,
          req.session.oauth_access_token_secret,
          'application/json',
          function(err, data, result) {
            const userAuth = JSON.parse(data);
            if (!err) {
              // const params = {
              //   username: user.name,
              //   email: user.emailAddress,
              //   access_token: oauth_access_token,
              //   access_token_secret: oauth_access_token_secret,
              //   hash: session,
              // };

              // // In case user record exists
              // const updates = {
              //   username: user.name,
              //   access_token: oauth_access_token,
              //   access_token_secret: oauth_access_token_secret,
              //   hash: session,
              // };

              console.log('DEBUG user auth ', userAuth);
              UserProxy.getUserByLoginName(userAuth.name, (err, user) => {
                console.log('DEBUG 111. get login user', err, user);
                if (!user) {
                  // UserProxy: newAndSave = function (name, loginname, pass, email, avatar_url, active, callback)
                  const avatarUrl = `${JIRA_SITE_URL}/secure/useravatar?ownerId=${userAuth.name}`;
                  const user = new User({
                    loginname: userAuth.name,
                    pass: session,
                    email: userAuth.emailAddress,
                    avatar: avatarUrl,
                    active: true,
                  });

                  user.save((err, result) => {
                    if (!err) {
                      authMiddleWare.gen_session(user, res);

                      res.redirect('/');
                    } else {
                      res.status(500).send('database error');
                    }
                  });
                } else {
                  user.hash = session;
                  user.save((err, result) => {
                    if (!err) {
                      authMiddleWare.gen_session(user, res);

                      res.redirect('/');
                    } else {
                      res.status(500).send('database error');
                    }
                  });
                }
              });
            } else {
              res.status(500).send('database error');
            }
          }
        );
      }
    }
  );
}

module.exports = {
  jiraAuth: jiraAuth,
  jiraCallback: jiraCallback,
};
