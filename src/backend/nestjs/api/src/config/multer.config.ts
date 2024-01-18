import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from 'src/user/user.interface';

export const multerConfig: MulterModuleOptions = {
	storage: diskStorage ({
		destination: './src/user/avatar-uploads',
		filename: (req, file, callback) => {
			const user = req.user as User;
			const filename = "avatar-user" + user.id.toString();
			const uniqueSuffix = Date.now();
			callback(null, filename + '-' + uniqueSuffix + extname(file.originalname));
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
