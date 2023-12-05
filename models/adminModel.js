const mongoose = require("mongoose");
const Joi = require("joi");

// const passportLocalMongoose=require("passport-local-mongoose")

const schema = mongoose.Schema;

const adminSchema = new schema(
    {

        name: { type: String, required: true },
        mobile: { type: Number, trim: true },
        verified: { type: Boolean },
        password: { type: String, trim: true },
        profilePic: { type: String },
    },
    { timestamps: true }
);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .regex(/^[a-zA-Z0-9 ,.'-]+$/)
            .min(3)
            .max(50)
            .required(),
        password: Joi.string().min(8).max(255).required(),
        mobile: Joi.string()
            .regex(/^[0-9]+$/)
            .min(10)
            .max(10)
            .required(),
    });
    let result = schema.validate(user);
    //   if (!result["error"]) result = validatePassword(user.password);

    return result;
}

const Admin = mongoose.model("Admin", adminSchema);
exports.Admin = Admin;
exports.validateAdmin = validateUser;
