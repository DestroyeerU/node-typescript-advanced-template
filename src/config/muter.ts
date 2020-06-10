import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (_req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err, '');

        const newFileName = res.toString('hex') + extname(file.originalname);

        return cb(null, newFileName);
      });
    },
  }),
};