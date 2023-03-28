var express = require('express');
var AWS = require('aws-sdk');
var router = express.Router();


const access_key = "AKIARAR74F5B2ZJFROOU"
const secret_key = "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"

// Setting the aws credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: 'temp' });
credentials.accessKeyId = access_key;
credentials.secretAccessKey = secret_key;
AWS.config.credentials = credentials;
AWS.config.update({
  region:'us-east-1'
});

// Route path 
router.post('/classify', async function(req, res, next) {

  const client = new AWS.Rekognition();
  const params = {
    Image: {
      Bytes: req.files.file.data, // data to be processed
    },
    MaxLabels: 10
  }

  let labelsContent = []; 

  await client.detectLabels(params, function(err, response) {
    if (err) {
      console.log(err, err.stack); // if error occurs
    } else {
      response.Labels.forEach(label => {
        labelsContent.push(label.Name);
      }) 
    } 
  }).promise().then(() => {
    // returns the labels in response
    res.json({
      "labels": labelsContent
    });
  }).catch((err) => {
    // returns the error in response
    res.json({
      "error": err
    });
  });

});

module.exports = router;
