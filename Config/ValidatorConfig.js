const Joi = require("joi");
const ROLES = require("../Config/ConstConfig");

const userValidationSchema = Joi.object({
    _id: Joi.object({
        $oid: Joi.string().length(24).hex(), // Ensure valid MongoDB ObjectID
    }),

    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30).
        required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "tn"] } })
        .required(),

    password: Joi.string()
        .required(),
    //.pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{3,30}$'))

    role: Joi.string().valid(ROLES.RA, ROLES.RPA, ROLES.RTA).required(),
}).options({ abortEarly: false, allowUnknown: true });



const empolyeeValidationSchema = Joi.object({

    fullName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "tn"] } })
        .required(),

    position: Joi.string()
        .required(),

    rank: Joi.number()
        .required(),

    entryDate: Joi.date()
        .iso() //iso => format 'YYYY-MM-DD'
        .required(),

}).options({ abortEarly: false, allowUnknown: true }); //execlure  les champs supplementaires de la validation


const projectValidationSchema = Joi.object({

    label: Joi.string()
        .alphanum()
        .min(5)
        .max(100)
        .required(),

    description: Joi.string()
        .alphanum()
        .min(25)
        .max(150)
        .required(),
}).options({ abortEarly: false, allowUnknown: true });


const releaseValidationSchema = Joi.object({

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required(),

    description: Joi.string()
        .alphanum()
        .min(25)
        .max(150)
        .required(),

    start_date: Joi.date()
        .iso()
        .required(),

    end_date: Joi.date()
        .iso()
        .required(),
});


const demandValidationSchema = Joi.object({

    title: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required(),

    description: Joi.string()
        .alphanum()
        .min(25)
        .max(150)
        .required(),

    start_date: Joi.date()
        .iso()
        .required(),

    end_date: Joi.date()
        .iso()
        .required(),

    estimation: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required(),

})
module.exports = {
    userValidationSchema,
    empolyeeValidationSchema,
    projectValidationSchema,
    releaseValidationSchema,
    demandValidationSchema,
};
