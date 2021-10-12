'use strict';

module.exports = (app) => {
    // 404 error
    app.use((req, res, next) => {
        const result = {
            status: 404,
            message: '404 Not Found',
            error: {},
            data: {}
        };

        return res.status(404).json(result);
    });

    // 500 server error
    app.use((
        err,
        req,
        res,
        next
    ) => {
        console.error(err);
        
        const result = {
            status: 500,
            message: '500 Server Error',
            error: err,
            data: {}
        };

        return res.status(500).json(result);
    });
}