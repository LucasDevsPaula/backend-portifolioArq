import { fileURLToPath } from "url";
import { dirname, extname, resolve } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import crypto from "crypto";
import multer from "multer";


export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', folder),
        filename: (req, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString("hex");
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    };
  },
};
