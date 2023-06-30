import AWS from 'aws-sdk';
const {AWS_SECRET_KEY, AWS_ACCESS_KEY, AWS_REGION} = process.env;

const s3 = new AWS.S3({
  secretAccessKey: AWS_SECRET_KEY,
  accessKeyId: AWS_ACCESS_KEY,
  region: AWS_REGION,
});
export const getSignedUrl = ({key}: any) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: 'image-resize-bk',
        Fields: {key},
        Expires: 300,
        Conditions: [
          ['content-length-range', 0, 50 * 1000 * 1000],
          ['starts-with', '$Content-Type', 'image/'],
        ],
      },
      (err, data) => {
        if (err) reject(err);
        resolve(data);
      }
    );
  });
};
