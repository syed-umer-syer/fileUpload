const express = require('express'),
    path = require('path'),
    cors = require('cors'),

    fileRoute = require('../modules/fileSystem/routes/fileSystem.routes');

const app = express(),
port = process.env.PORT || 3000;
// app.use('/fileSystem', fileRoute)
const createServer = async () => {
    // app.use(express.json({ limit: '100mb' }))
    app.use(express.raw({ limit: '100mb' }))

    app.use(express.urlencoded({ limit: '100mb', extended: true }))

    app.use(cors(
        {
            "origin": "*",
            "methods": "GET,PUT,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 200,
            "exposedHeaders": "Access-Control-Allow-Method,Access-Control-Allow-Origin,Content-Type,Content-Length"
        }
    ))

    // routes
    require('../modules/fileSystem/routes/fileSystem.routes')(app);

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`)
    })
};
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on port ${process.env.PORT}`)
// })

module.exports = {
    createServer
}