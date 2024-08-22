import multer from 'multer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../uploads`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB file size limit
};

const upload = multer({ storage: storage, limits })


export { upload };