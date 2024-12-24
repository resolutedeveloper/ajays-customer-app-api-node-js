function validateRequest(req, res, next, schema) {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      res.status(400);
      res.send({
        ErrorCode: "VALIDATION",
        ErrorMessage: `Validation error: ${error.details
          .map((x) => x.message)
          .join(", ")}`,
      });
    } else {
      req.body = value;
      next();
    }
  }
  module.exports = { validateRequest }