import * as express from 'express';
import { requiresAuth } from 'express-openid-connect';

// The view engine (ejs) routes
export default express
  .Router()
  .get('/', (req, res, _) => {
    res.render('index', {
      title: 'Auth0 Webapp sample Nodejs',
      isAuthenticated: req.oidc.isAuthenticated(),
    });
  })
  .get('/profile', requiresAuth(), (req, res, _) => {
    res.render('profile', {
      userProfile: JSON.stringify(req.oidc.user, null, 2),
      title: 'Profile page',
    });
  });
