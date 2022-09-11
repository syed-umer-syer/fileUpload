const {resizeAndUpload} = require('../helpers/fileSystem.helpers')

class FileController {

    async create(req, res) {
        try {
            const dataChunks = [];
            let content = null,
                fileName = req.params.fileName || Date.now(),
                ext = req.headers[`content-type`].split('/')[1],
                completeFileName = ` ${fileName}.${ext}`,
                validExtensions = process.env.VALIDEXTENSIONS.split(",");

            if (!validExtensions.includes(ext)) { // check if the file type is allowed
                return res.status(400).send(
                    {
                        success: false,
                        message: `acceptable file types are ${process.env.VALIDEXTENSIONS}`
                    }
                )
            }

            if (Number(process.env.FILESIZE) < req.headers[`content-length`]) { // check if file size is correct
                return res.status(400).send({ success: true, message: "file size limit exceeded" });
            }

            req.on('data', (chunk) => { // read data in chunks 

                dataChunks.push(chunk)
            });

            req.on('end', async () => {
                content = Buffer.concat(dataChunks);
                let response = await resizeAndUpload(content, completeFileName, req.headers[`content-type`], ext)
                return res.status(200).send({ success: true, response });

            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ success: false, message: "error occured while uploading file" })
        }

    }


}

module.exports = new FileController()