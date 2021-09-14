import express from 'express';
import { authentication } from '../middlewares';
import { createUserService, loginUserService } from '../service';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await createUserService({ name, email, password });
    res.status(201).send({ name, email, password }).status(201);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/users/login', async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const token = await loginUserService({ email, password });
    res.status(200).send(token);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.get('/users/points', authentication, async (req, res) => {
  res.status(200).send({ message: 'authenticated' });
});

export { router };
