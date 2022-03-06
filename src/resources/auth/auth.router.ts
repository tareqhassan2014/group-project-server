import { Router } from 'express';
import { login, signUp } from './auth.controller';

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
// router.get(
//     '/auth-user',
//     passport.authenticate('jwt', { session: false }),
//     accessControl.grantAccess('readOwn', 'profile'),
//     AuthController.authUser
// );
export default router;
