
import ImageKit from "imagekit";
import * as dotenv from 'dotenv'
dotenv.config()

// SDK initialization
var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL
});

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL) {
  console.warn('Warning: ImageKit credentials are not fully set in environment variables')
}

const uploadService = ({ file, fileName, url }, callback) => {
  if (file === undefined || fileName === undefined) {
    if (url === undefined) {
      return callback(
        {
          message: "File Required",
        },
        ""
      );
    }
  }

  imagekit.upload({
    file: file?.data || url,
    fileName: fileName || url.split('/').pop().toString(),
  }).then(response => {
    // console.log('response', response?.url);
    return callback(null, { url: response?.url })
  }).catch(error => {
    console.log(error);
    return callback({
      message: "Unable to upload image"
    })
  });
}

export { uploadService }