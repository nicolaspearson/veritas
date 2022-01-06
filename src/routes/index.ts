import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';

export const router = Router();

router.get('/', (req, res, _) => {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

router.get('/profile', requiresAuth(), (req, res, _) => {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page',
  });
});
