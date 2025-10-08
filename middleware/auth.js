export const requireAuthPage = (req, res, next) => {
  if (req.session?.user) return next();
  return res.redirect('/account/login');
};

export const requireGuestPage = (req, res, next) => {
  if (req.session?.user) return res.redirect('/'); // already logged in
  return next();
};
