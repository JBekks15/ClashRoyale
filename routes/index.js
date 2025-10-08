import accountRoutes from './account.js';
import express from 'express';
import { requireAuthPage } from '../middleware/auth.js';

const constructorMethod = (app) => {
  app.use('/account', accountRoutes);

  // Example home/dashboard (protected)
  app.get('/', requireAuthPage, (req, res) => {
    res.send(`<div style="padding:2rem;font-family:sans-serif">
      <h2>Welcome, ${req.session.user.username}</h2>
      <form method="POST" action="/account/logout">
        <button>Logout</button>
      </form>
    </div>`);
  });

  // 404
  app.all(/.*/, (_req, res) => res.status(404).send('Not found'));
};

export default constructorMethod;
