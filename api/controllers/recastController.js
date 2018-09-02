'use strict';
var https = require('https');
const request = require('request');
const salesOrderApi = "https://cc2-715-api.wdf.sap.corp/sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder";
const postToRecast = (params,callback) => {
	var apiUrl = 'https://api.recast.ai/build/v1/dialog';
	var authHeaderValue = 'Token 35417c92c6fedd3aa4ffa589c76b7792';
	console.log("Preparing for posting to Recast API : " + apiUrl);
	var headers = { 'Authorization' : authHeaderValue };
	var myPayload = new Object();
	myPayload = params;
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

const getCsrfTokenForSalesOrderApi = (params, callback) => {
	var apiUrl = salesOrderApi + "('16839')?$format=json";
	console.log("Trigger get CSRF token to the URL " + apiUrl);
	var authHeaderValue = 'Basic U0RfQVBJXzAxMDk6bHlCTXhvS2h5Q0xTTW11ZTdzTnREeE5LQ0tSXFhEYXVjR3lQeHlpag==';
	var headers = { 'Authorization' : authHeaderValue , 'X-CSRF-Token' : 'Fetch'  };
	var options = {
			method: 'GET',
			uri : apiUrl,
			headers: headers,			
			json: true
  };
	request.get(options, (err, response, body) => {
	    if (err) {
	    	console.log("Error in making the call to Sales Order API for getting CSRF token")
	    	console.log("Error message is " + err)
	      err.statusCode = 500; 
	      callback(err);
	      return;
	    } else if (response.statusCode !== 200) {
	      console.log('Request to Sales Order CSRF Token failed with status : %s and body : %s',response.statusCode, body);
	      err.statusCode = 500;
	      callback(err,null);
	      return;
	    } else {
	      console.log('Response Success for Sales Order CSRF creation call ');
        var csrfToken = response.headers['x-csrf-token'];
        var cookie = response.headers['set-cookie'];
        console.log("Cookies are loaded: " + cookie);
	      callback(null, csrfToken, cookie);
	      
	      return;
	    }
	  });
};

const createSalesOrderWithApi = (params, callback) => {
  var csrfToken = params.csrfToken;
  var cookie = params.cookie;
	var apiUrl = salesOrderApi;
	var authHeaderValue = 'Basic U0RfQVBJXzAxMDk6bHlCTXhvS2h5Q0xTTW11ZTdzTnREeE5LQ0tSXFhEYXVjR3lQeHlpag==';
  var headers = { 'Authorization' : authHeaderValue , 'X-CSRF-Token' : csrfToken, 'cookie': cookie };
  console.log("CSRF TOken:" + csrfToken);
	var myPayload = new Object();
	var salesOrderData = new Object();
	salesOrderData.SalesOrderType = "OR";
	salesOrderData.SalesOrganization = "1810";
	salesOrderData.DistributionChannel = "10";
	salesOrderData.OrganizationDivision = "00";
	salesOrderData.SalesGroup = "180";
	salesOrderData.SalesOffice = "180";
	salesOrderData.SalesDistrict = "";
	salesOrderData.SoldToParty = "S18100252";
	salesOrderData.PurchaseOrderByCustomers = "Test BAPI";
	salesOrderData.CustomerPurchaseOrderType = "";
	salesOrderData.CustomerPurchaseOrderDate = null;
	salesOrderData.TotalNetAmount = "0.00";
	salesOrderData.TransactionCurrency = "EUR";
	salesOrderData.SDDocumentReason = "";
	salesOrderData.PricingDate = "\/Date(1445385600000)\/";
	salesOrderData.RequestedDeliveryDate = "\/Date(1521417600000)\/";
	salesOrderData.ShippingCondition = "01";
	salesOrderData.CompleteDeliveryIsDefined = false;
	salesOrderData.ShippingType = "";
	salesOrderData.HeaderBillingBlockReason = "";
	salesOrderData.DeliveryBlockReason = "";
	salesOrderData.IncotermsClassification = "CFR";
	salesOrderData.IncotermsTransferLocation = "";
	salesOrderData.IncotermsLocation1 = "ABC";
	salesOrderData.IncotermsLocation2 = "ABC";
	salesOrderData.IncotermsVersion = "2010";
	salesOrderData.CustomerPaymentTerms = "0001";
	salesOrderData.PaymentMethod = "";
	salesOrderData.AssignmentReference = "";
	salesOrderData.OverallSDProcessStatus = "B";
	salesOrderData.TotalCreditCheckStatus = "";
	salesOrderData.OverallTotalDeliveryStatus = "C";
	salesOrderData.OverallSDDocumentRejectionSts = "A";
	myPayload.d = salesOrderData;
	var options = {
			method: 'POST',
			uri : apiUrl,
			headers: headers,
			body: myPayload,
			json: true
  };
  console.log("Making post request to api call");
	request.post(options, (err, response, body) => {
	    if (err) {
	    	console.log("Error in making the call to Sales Order API")
	    	console.log("Error message is " + err)
	      err.statusCode = 500; 
	      callback(err);
	      return;
	    } else if (response.statusCode !== 201) {
	      console.log('Request to Sales Order failed with status : %s and body : %s',response.statusCode, body);
	      err.statusCode = 500;
	      callback(err,null);
	      return;
	    } else {
	      console.log('Response Success for Sales Order creation call ');
	      var responsePath = response.headers['location'];
	      callback(null, responsePath);
	      
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
	var message = {};
	message.type = 'text';
	message.content = req.body.msg;
	params.message = message;
	params.conversation_id = 'test-1234567';
	params.log_level = 'info';
	
	postToRecast(params, (err,body) => {
		var result = {};
	
		if(err) {
			console.log("response failure");
			result = { "Status" : "Failure with " + err.statusCode};
		}else {
			console.log("response success");
			var result = body.results.messages[0];
			result = { "Status" : result};
		}
		res.json(result);
	});
	
	
}

exports.createSalesOrder = function(req,res){
	console.log("Going to create Sales Order");
	var params = {};
	var result = {};
	getCsrfTokenForSalesOrderApi(params, (err,csrfToken,cookie) => {
		if(err){
			console.log("response failure for getting csrf token");
			result = { "Status " : " Failure with " + err.statusCode};
		} else {
      params.csrfToken = csrfToken;
      params.cookie = cookie;
			createSalesOrderWithApi(params, (err,responsePath) => {
				
				if(err){
					console.log("response failure for creating sales order");
					result = { "Status " : " Failure with " + err.statusCode};
				}else {
					console.log("response success for creating sales order");
					var result = {};
					result = {"Status" : responsePath} ;
				}
				
			});
		}
		
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