const Transcript = require("./models/Transcript");
const Users = require("./models/Users");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const port = process.env.PORT;
module.exports = {
  init: function (app, config) {
    var fs = require("fs");
    var mongoose = require("mongoose");
    const db_URL =
      port === "5000"
        ? config.db_URL_HP
        : port === "5001"
        ? config.db_URL_EXPO
        : config.db_URL_XCYTE;
    mongoose.connect(db_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const ALLOW_DUPLICATE = true;
    /**
     * For saving users visited
     */
    app.post("/rest/save-user", (req, res) => {
      let params = req.body;
      const users = new Users(params);
      const findUser = Users.find({
        name: params.name,
        email: params.email,
      }).exec((err, user) => {
        if (err) return;
        if (user.length !== 0) {
          let resultObj = {};
          resultObj.status = "success";
          resultObj.message = "User-Data retrieved successfully";
          resultObj.results = user[0];
          return res.end(JSON.stringify(resultObj));
        } else {
          return users.save().then((doc) => {
            let resultObj = {};
            resultObj.status = "success";
            resultObj.message = "Saved successfully";
            resultObj.results = doc;
            res.end(JSON.stringify(resultObj));
          });
        }
      });
    });
    /**
     * For admin details
     */
    app.post("/rest/login-admin", async (req, res) => {
      let { username, password, email, initialAdmin = false } = req.body;
      try {
        const admin = new Admin({
          name: username,
          email,
          password,
        });
        initialAdmin &&
          (await admin.save().then((admin) => {
            if (admin) {
              res.status(200).json({
                status: true,
                message: "Admin created successfully",
                results: {
                  id: admin._id,
                  name: admin.name,
                  email: admin.email,
                },
              });
            }
          }));
        !initialAdmin &&
          Admin.findOne({
            name: username,
            email,
          }).exec(async (err, admin) => {
            console.log("find admin", admin);
            if (err) {
              res.status(400).json({
                status: false,
                message: "Error: Failed to fetch the admin details",
                results: {},
              });
            }
            if (!admin) {
              res.status(400).json({
                status: false,
                message: "Admin details not found",
                results: {},
              });
            }
            if (admin) {
              const passwordMatch = await bcrypt.compare(
                password,
                admin.password
              );
              if (!passwordMatch) {
                res.status(400).json({
                  status: false,
                  message: "Invalid credentials",
                  results: {},
                });
              } else {
                res.status(200).json({
                  status: true,
                  message: "Admin details retrieved successfully",
                  results: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                  },
                });
              }
            }
          });
      } catch (error) {
        res
          .status(500)
          .json({ status: "false", message: `${error?.message}`, results: {} });
      }
    });

    /**
     * For saving transcript
     */
    app.post("/rest/save-transcript", (req, res) => {
      let params = req.body;
      const transcript = new Transcript(params);
      return transcript.save().then((doc) => {
        let resultObj = {};
        resultObj.status = "success";
        resultObj.message = "Saved successfully";
        resultObj.results = doc;
        res.end(JSON.stringify(resultObj));
      });
    });
    /**
     * For getting transcript
     */
    app.get("/rest/fetch-transcript/:sessionId", (req, res) => {
      let params = { sessionId: req.params.sessionId };
      console.log(params);
      var resultObj = {};
      Transcript.find(params, {}, { skip: 0, limit: 10000 })
        .populate("sessionId")
        .sort({ date: 1 })
        .exec(function (error, doc) {
          if (doc.length > 0) {
            resultObj.status = "success";
            resultObj.message = "Transcript fetch Successfully";
            resultObj.results = doc;
            res.end(JSON.stringify(resultObj));
          } else {
            resultObj.status = "failed";
            resultObj.message = "No transcripts found !";
            resultObj.results = [];
            res.end(JSON.stringify(resultObj));
          }
        });
    });
    /**
     * For getting all users
     */
    app.get("/rest/fetch-users", (req, res) => {
      let params = req.body;
      var resultObj = {};
      Users.find(params, {}, { skip: 0, limit: 10000 })
        .sort({ date: -1 })
        .exec(function (error, doc) {
          if (doc.length > 0) {
            resultObj.status = "success";
            resultObj.message = "Users Listed Successfully";
            resultObj.results = doc;
            res.end(JSON.stringify(resultObj));
          } else {
            resultObj.status = "failed";
            resultObj.message = "No users found !";
            resultObj.results = [];
            res.end(JSON.stringify(resultObj));
          }
        });
    });
  },
};
