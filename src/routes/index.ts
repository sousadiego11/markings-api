import express from 'express';
import cors from 'cors';
import { authentication } from '../middlewares';
import {
  createUserService,
  loginUserService,
  createMarkerService,
  getMarkersService,
} from '../service';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

router.get('/markers', async (_req: any, res: any) => {
  try {
    const markers = await getMarkersService();
    res.status(201).send(markers);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

router.post('/markers', authentication, async (req: any, res: any) => {
  try {
    const marker = await createMarkerService({ ...req.body.marker, idUser: req.user.id });
    res.status(201).send(marker);
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

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

router.post('/users/auth', authentication, async (req: any, res: any) => {
  res.status(200).send(req.user);
});

export { router };
