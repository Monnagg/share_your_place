const express = require("express");
const HttpError = require("../models/http-error");
const usersControllers = require("../controllers/users-controllers");
const { check } = require('express-validator');
const fileUpload = require('../middleware/file-upload')


const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", [
    fileUpload.single('image'),
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 })
  ], usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;
