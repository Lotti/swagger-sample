const log4js = require('log4js');
const log = log4js.getLogger('api');

module.exports.aTest = async (req, res) => {
    const params = req.swagger.params;
    log.fatal('%j', params);
    res.json({message: "ok"});
};
