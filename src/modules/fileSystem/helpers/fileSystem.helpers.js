const aws = require('aws-sdk'),
    jimp = require('jimp');

let resizeAndUpload = async (buffer, name, contentType, ext) => {
    try {
        let imageExtensionArray = ["jpg", "jpeg", "png"];
        if (!imageExtensionArray.includes(ext)) {
            return await uploadFile(name, buffer, contentType);
        }
        let image = await jimp.read(buffer),
            fullResolution = await image.resize(2048, jimp.AUTO).getBufferAsync(jimp.MIME_JPEG),
            hdImage = await image.resize(1024, jimp.AUTO).getBufferAsync(jimp.MIME_JPEG),
            thumb = await image.resize(300, jimp.AUTO).getBufferAsync(jimp.MIME_JPEG);
        let data = [fullResolution, hdImage, thumb],
            response = [];
        for (let image of data) {
            response.push(await uploadFile(`${Date.now()}+${name}`, image, 'image/jpeg'))
            console.log("going over iterations", response);
        }
        return response;

    } catch (error) {
        console.log(error);
        throw {
            message: "error occured while resizing images",
            code: 500
        }
    }
}

const uploadFile = async (fileName, content, contentType) => {
    try {
        const s3 = new aws.S3({
            accessKeyId: process.env.ACCESSKEYID,
            secretAccessKey: process.env.SECRETACCESSKEY,
            region: process.env.REGION
        }),
            params = {
                Bucket: process.env.BUCKET,
                Key: fileName,//completeFileName
                Body: content,
                contentType: contentType,//contentType req.headers[`content-type`]
                ACL: 'public-read'
            };

        let data = await s3.upload(params).promise()
        if (data && data.Location) return data.Location;
        return data;
    } catch (error) {
        throw {
            err: "error occured while uploading files to s3",
            code: 500
        }
    }
}
module.exports = {
    uploadFile,
    resizeAndUpload
}