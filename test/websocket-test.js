/* Global Includes */
var testCase   = require('mocha').describe;
var pre        = require('mocha').before;
var preEach    = require('mocha').beforeEach;
var post       = require('mocha').after;
var postEach   = require('mocha').afterEach;
var assertions = require('mocha').it;
var assert     = require('chai').assert;
var validator  = require('validator');
var exec       = require('child_process').execSync;
var artik      = require('../lib/artik-sdk');


/* Test Specific Includes */
var websocket         = require('../src/websocket');
var auth_token        = process.env.WEBSOCKET_ACCESS_TOKEN;
var device_id         = process.env.WEBSOCKET_DEVICE_ID;
var host              = "api.artik.cloud";
var uri               = "/v1.1/websocket?ack=true";
var port              = 443;
var ssl_connection    = 2;
var use_se            = false;
var register_message  = '{"sdid":"' + device_id + '","Authorization":"bearer ' + auth_token + '","type":"register"}';

var conn = new websocket(host, uri, port, ssl_connection, use_se);

/* Test Case Module */
testCase('Websockets', function() {

	this.timeout(10000);

	pre(function() {

		conn = new websocket(host, uri, port, ssl_connection, use_se);

	});

	testCase('#open_stream(), on(connected)', function() {

		assertions('Return callback event when the websocket is connected', function(done) {

			conn.on('connected', function(result) {
				console.log("Connect result: " + result);
				assert.equal(result, "CONNECTED");
				done();
			});

			conn.open_stream();
		});

	});

	testCase('#write_stream(), on(receive)', function() {

		assertions('Return callback event when the data is received', function(done) {

            if (!auth_token || !device_id || !auth_token.length || !device_id.length)
                this.skip();

			conn.on('receive', function(message) {
				console.log("received: " + message);
				assert.isNotNull(message);
				assert.equal(JSON.parse(message).data.code, "200");
				assert.equal(JSON.parse(message).data.message, "OK");
				done();
			});

			conn.write_stream(register_message);
		});

	});

	post(function() {
	});

});
