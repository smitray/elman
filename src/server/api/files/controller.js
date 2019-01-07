import { fileUpload, fileDelete } from '@utl';
import { filesCrud, filesModel } from './files.model';


let filesNew;

const bulkUpdate = options => new Promise((resolve, reject) => {
  filesModel.insertMany(options).then((result) => {
    resolve(result);
  }).catch((err) => {
    reject(err);
  });
});

/**
@api {post} /api/files File upload
@apiName Upload file
@apiGroup Utility
@apiHeader {String} Authorization JWT
@apiHeaderExample Header example
{
  "Authorization": "Bearer JWT"
}
@apiParam {String} docs File / Files (Use form data)
@apiParamExample {json} Input
{
  "docs": "file"
}
@apiSuccessExample {json} Success
{
  "success": 1,
  "data": {
    "files": {
      "filename": "file name",
      "permalink": "link of the file",
      "_id": "file ID"
    }
  },
  "message": "All files uploaded"
}
@apiErrorExample {json} Server error
  HTTP/1.1 500 Internal Server Error
@apiErrorExample {json} Wrong credentials
  HTTP/1.1 401 Not authorized
@apiErrorExample {json} Wrong form key
  HTTP/1.1 422 Unprocessable entity
*/

const filesCreate = async (ctx) => {
  const rawFiles = ctx.request.body.files.docs;
  const fileNames = [];
  let filename;
  if (rawFiles instanceof Array) {
    await Promise.all(rawFiles.map(async (file) => {
      filename = await fileUpload(file);
      fileNames.push({
        filename: filename.file,
        permalink: `/public/${filename.file}`,
        thumbnail: `/public/thumbs/${filename.thumbnail}`
      });
    }));

    try {
      filesNew = await bulkUpdate(fileNames);
    } catch (e) {
      ctx.throw(422, {
        success: 0,
        message: e.message
      });
    } finally {
      ctx.body = {
        success: 1,
        data: {
          files: filesNew
        },
        message: 'All files uploaded'
      };
    }
  } else {
    filename = await fileUpload(rawFiles);
    try {
      filesNew = await filesCrud.create({
        filename: filename.file,
        permalink: `/public/${filename.file}`,
        thumbnail: `/public/thumbs/${filename.thumbnail}`
      });
    } catch (e) {
      ctx.throw(422, {
        success: 0,
        message: e.message
      });
    } finally {
      ctx.body = {
        success: 1,
        data: {
          files: filesNew
        },
        message: 'File uploaded'
      };
    }
  }
};

/**
@api {post} /api/files/delete File delete
@apiName Delete file
@apiGroup Utility
@apiHeader {String} Authorization JWT
@apiHeaderExample Header example
{
  "Authorization": "Bearer JWT"
}
@apiParam {String} fileId File / Files (Use form data)
@apiParamExample {json} Input
{
  "fileId": "file"
}
@apiSuccessExample {json} Success
{
  "success": 1,
  "data": {
    "files": {
      "filename": "file name",
      "permalink": "link of the file",
      "_id": "file ID"
    }
  },
  "message": "File deleted"
}
@apiErrorExample {json} Server error
  HTTP/1.1 500 Internal Server Error
@apiErrorExample {json} Wrong credentials
  HTTP/1.1 401 Not authorized
@apiErrorExample {json} Wrong form key
  HTTP/1.1 422 Unprocessable entity
*/

const deleteFiles = async (ctx) => {
  try {
    filesNew = await filesCrud.delete({
      params: {
        qr: {
          _id: ctx.request.body.fileId
        }
      }
    });
    await fileDelete(filesNew.filename);
  } catch (e) {
    ctx.throw(422, {
      success: 0,
      message: e.message
    });
  } finally {
    ctx.body = {
      success: 1,
      data: {
        files: filesNew
      },
      message: 'File deleted'
    };
  }
};

export {
  filesCreate,
  deleteFiles
};
