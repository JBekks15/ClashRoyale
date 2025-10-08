import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, getUserByPlayerTag, getUserByUsername } from '../data/users.js';
import { requireAuthPage, requireGuestPage } from '../middleware/auth.js';
import { fetchBattlelogJSON } from '../data/battlelog.js';

const router = express.Router();

// GET /account/login  -> render login page
router.get('/login', requireGuestPage, (req, res) => {
  res.render('login');
});

// POST /account/login
router.post('/login', requireGuestPage, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).render('login', { error: 'Username and password are required' });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }

    req.session.user = { _id: user._id.toString(), username: user.username };
    return res.redirect('/'); // send to home/dashboard
  } catch (e) {
    return res.status(500).render('login', { error: 'Server error' });
  }
});

// GET /account/signup  -> render signup page
router.get('/signup', requireGuestPage, (req, res) => {
  res.render('signup');
});

// POST /account/signup
router.post('/signup', requireGuestPage, async (req, res) => {
  try {
    const { username, password, playerTag} = req.body || {};
    if (!username || !password) {
      return res.status(400).render('signup', { error: 'Username and password are required' });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).render('signup', { error: 'Username already taken' });
    }

    let battlelog;
    try {
        battlelog = await fetchBattlelogJSON(playerTag);
    } catch {
        return res.status(400).render('signup', { error: 'Invalid player tag.' });
    }
    



    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(username, hash, playerTag);

    req.session.user = { _id: user._id.toString(), username: user.username };
    return res.redirect('/'); // auto-login after signup
  } catch (e) {
    return res.status(500).render('signup', { error: 'Server error' });
  }
});

// POST /account/logout
router.post('/logout', requireAuthPage, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('AuthCookie');
    res.redirect('/account/login');
  });
});

export default router;
