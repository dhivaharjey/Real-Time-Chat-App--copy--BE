import Joi from "joi";

// SignUp validation schema
const signUpSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": `"Name" should be a type of 'text'`,
    "string.empty": `"Name" cannot be an empty field`,
    "string.min": `"User Name" should have a minimum length of 3`,
    "string.max": `"Name" should have a maximum length of 30`,
    "any.required": `"Name" is a required field`,
  }),
  email: Joi.string()
    .trim()
    // .custom((value, helper) => {
    //   return value.toLowerCase();
    // })
    .email()
    .required()
    .messages({
      "string.base": `"Email" should be a type of 'text'`,
      "string.empty": `"Email" cannot be an empty field`,
      "string.email": `"Email" must be a valid email`,
      "any.required": `"Email" is a required field`,
    }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required()
    .messages({
      "string.pattern.base": `"Password" must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`,
      "string.empty": `"Password" cannot be an empty field`,
      "any.required": `"Password" is a required field`,
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": `"Confirm Password" must match "Password"`,
    "any.required": `"Confirm Password" is a required field`,
  }),
  picture: Joi.string().optional(),
  // picture: Joi.object({
  //   fileName: Joi.string()
  //     .optional()
  //     .custom((value, helpers) => {
  //       const fileExtension = value.split(".").pop().toLowerCase();
  //       if (!["png", "jpeg", "jpg"].includes(fileExtension)) {
  //         return helpers.message(
  //           "Image must be a valid png, jpg, or jpeg file"
  //         );
  //       }
  //       return value;
  //     }),
  //   fileSize: Joi.number()
  //     .max(2 * 1024 * 1024) // 2MB in bytes
  //     .messages({
  //       "number.max": `"Image" size must not exceed 2MB`,
  //     }),
  // }).optional(),
});

// LogIn validation schema
const logInSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": `"Email" should be a type of 'text'`,
    "string.empty": `"Email" cannot be an empty field`,
    "string.email": `"Email" must be a valid email`,
    "any.required": `"Email" is a required field`,
  }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required()
    .messages({
      "string.pattern.base": `"Password" must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`,
      "string.empty": `"Password" cannot be an empty field`,
      "any.required": `"Password" is a required field`,
    }),
});

const resetPassword = Joi.object({
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required()
    .messages({
      "string.pattern.base": `"Password" must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`,
      "string.empty": `"Password" cannot be an empty field`,
      "any.required": `"Password" is a required field`,
    }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": `"Confirm Password" must match "Password"`,
    "any.required": `"Confirm Password" is a required field`,
  }),
});
// Validator function
const validator = (schema) => (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((err) => err.message);
    throw new Error(message.join(", "));
  }
  return value;
};

export const signUpValidation = validator(signUpSchema);
export const logInValidation = validator(logInSchema);
export const resetPasswordValidation = validator(resetPassword);
