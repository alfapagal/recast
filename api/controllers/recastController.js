'use strict';
var https = require('https');
var logging = require('@sap/logging');
const request = require('request');

const postToRecast = (params,callback) => {
	var apiUrl = 'https://api.recast.ai/v2/request';
	var authHeaderValue = 'Token 35417c92c6fedd3aa4ffa589c76b7792';
	console.log("Preparing for posting to Recast API : " + apiUrl);
	var headers = { 'Authorization' : authHeaderValue };
	var myPayload = new Object();
	myPayload.text = params.text;
	myPayload.language = params.language;
	var options = {
			method: 'POST',
			uri : apiUrl,
			headers: headers,
			body: myPayload,
			json: true
	};
	request.post(options, (err, response, body) => {
	    if (err) {
	    	console.log("Error in making the call to Recast API")
	      err.statusCode = 500; 
	      callback(err);
	      return;
	    } else if (response.statusCode !== 200) {
	      console.log('Request to Recast failed with status : %s and body : %s',response.statusCode, body);
	      err.statusCode = 500;
	      callback(err,null);
	      return;
	    } else {
	      console.log('Response Success for Recast call ');
	      callback(null, body);
	      return;
	    }
	  });
};

exports.getConversation = function(req, res) {
    var result = {
        "Okay": "Working"
    };
    res.json(result);
};

exports.postConversation = function(req, res){
	 	
	console.log("Message is " + req.body.msg);
	var params = {};
	params.text = req.body.msg;
	params.language = 'en';
	postToRecast(params, (err,body) => {
		var result = {};
	
		if(err) {
			console.log("response failure");
			result = { "Status" : "Failure with " + err.statusCode};
		}else {
			console.log("response success");
			result = { "Status" : body};
		}
		res.json(result);
	});
	
	
}

// Use as sample

/*
 * exports.create_a_task = function(req, res) { var new_task = new
 * Task(req.body); new_task.save(function(err, task) { if (err) res.send(err);
 * res.json(task); }); };
 * 
 * 
 * exports.read_a_task = function(req, res) { Task.findById(req.params.taskId,
 * function(err, task) { if (err) res.send(err); res.json(task); }); };
 * 
 * 
 * exports.update_a_task = function(req, res) { Task.findOneAndUpdate({_id:
 * req.params.taskId}, req.body, {new: true}, function(err, task) { if (err)
 * res.send(err); res.json(task); }); };
 * 
 * 
 * exports.delete_a_task = function(req, res) {
 * 
 * 
 * Task.remove({ _id: req.params.taskId }, function(err, task) { if (err)
 * res.send(err); res.json({ message: 'Task successfully deleted' }); }); };
 * 
 */