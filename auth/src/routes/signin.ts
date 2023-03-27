import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  return res.send('hi there');
});

export { router as signinRouter };
