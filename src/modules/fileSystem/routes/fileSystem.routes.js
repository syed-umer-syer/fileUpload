const FileController = require('../controller/fileSystem.controller.js');

module.exports = async (app) => {
    
    app.post(`/api/v1/:fileName`, FileController.create);
    
};