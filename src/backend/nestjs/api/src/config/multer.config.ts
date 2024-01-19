import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig: MulterModuleOptions = {
	storage: diskStorage({
		destination: '../user/avatar-uploads',
		filename: (req, file, callback) => {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
		},
	}),
	fileFilter: (req, file, callback) => {
		if (file.mimetype.startsWith('image/')) {
			callback(null, true);
		} else {
			callback(new Error('Only image files are allowed!'), false);
		}
	},
};
