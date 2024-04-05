const mongoose = require('mongoose')
const {demandValidationSchema}= require('../Config/ValidatorConfig')

const demandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],

    },
    start_date: {
        type: Date,
        required: [true, "Please provide a start date of the demand "],
    },
    end_date: {
        type: Date,
        required: [true, "Please provide an end date of the demand"]
    },
    estimation: {
        type: String,
        required: [true, "Please provide an estimation"]
    },

    release: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'release'
        },
        name: {
            type: String,
            default: 'non assigned'
        },
        assignedProject: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'project'
            },
            label: {
                type: String,
                default: 'non assigned'
            }
        }
    }

})

module.exports = mongoose.model("demand", demandSchema)