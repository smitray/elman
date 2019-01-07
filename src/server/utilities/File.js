import { generate } from 'shortid';
import { join, extname } from 'path';
import fs from 'fs-extra';
import config from 'config';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';

const fileUpload = async (file) => {
  let thumbFile;
  const ext = extname(file.name);
  const fileType = file.type.split('/')[0];
  const fileName = `${Date.now()}-${generate()}`;
  const newFilename = `${fileName}${ext}`;
  const filePath = join(config.get('paths.static'), newFilename);
  try {
    await fs.copy(file.path, filePath);
    if (fileType === 'image') {
      thumbFile = `${fileName}.png`;
      await sharp(filePath)
        .resize(200, 200)
        .png()
        .toFile(join(config.get('paths.static'), `thumbs/${thumbFile}`));
    } else if (fileType === 'application') {
      thumbFile = 'generic/default-file.png';
    } else if (fileType === 'video') {
      thumbFile = `${fileName}.png`;
      await ffmpeg(filePath)
        .screenshots({
          timestamps: ['5%'],
          filename: thumbFile,
          folder: join(config.get('paths.static'), 'thumbs/'),
          size: '320x240'
        });
    }
  } catch (e) {
    throw new Error(e.message);
  }
  return {
    file: newFilename,
    thumbnail: thumbFile
  };
};

const fileDelete = async (file) => {
  const filePath = join(config.get('paths.static'), file);
  try {
    await fs.remove(filePath);
  } catch (e) {
    throw new Error(e.message);
  }
  return file;
};

export {
  fileUpload,
  fileDelete
};
