const Report = require('../Model/ReportModel')
const { StatusCodes } = require('http-status-codes')


const createReport = async (req, res) => {
try {
    const foundReport = await Report.findOne({
        if (foundReport){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: `${foundReport}  already exists.`,
            });
        }
    })
} catch (error) {
    
}
}


