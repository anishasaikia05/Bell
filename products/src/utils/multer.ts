import multer from 'multer';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({}),
  // fileFilter: (req: any, file: any, cb: any) => {
  //   let ext = path.extname(file.originalname);
  //   if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
  //     cb(new Error('File type is not supported. Please only submit jpg/jpeg/png images.'), false);
  //     return;
  //   }
  //   cb(null, true);
  // }
})

export { upload };