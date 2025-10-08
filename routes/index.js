import battleRoutes from './battlelog.js';


export const constructorMethod = (app) => {
  app.use('/battlelog', battleRoutes);

  app.all(/.*/, (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export default constructorMethod;