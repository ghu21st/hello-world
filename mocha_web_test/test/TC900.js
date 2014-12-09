//Test AngularJS test practice case
//QA test setup ----------------------------------------------
var case_ID = 900;

var err_msg;    //temp single error message
var err_array;  //error message array
var output_string=''; //result return array
var output_msg='';  //temp single result return
var test_startTime;
var test_endTime; //for time elapse calculation
var test_elapse = 0;

//global env settings
var TestConfig  = require('../Config/TestConfig.js');
var test_location = TestConfig.options.test_location;              //test base folder
var selenium_server = TestConfig.options.selenium_server;
var test_url= TestConfig.options.test_Url;

var testlog_location = test_location + "\\test_outputs";        //test log folder
var logFile = testlog_location + '\\' + case_ID + '.log';    //test log file name
var logger;

var chai = require('chai');
var expect = chai.expect;
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

var async = require('async');
var winston = require('winston'); //console/file logging module for testing
var os = require('os');
var nock = require('nock');   //mock library, REST API: post/put/get/delete/...
var nockOptions = {allowUnmocked: true};

var protractor = require('protractor');
var driver, ptor; //case web test driver global variable

//-------------------------------------------------------
describe('TC900: Protractor 1st case for AngularJS web page - check page title', function() {

    before(function(done1){
        //record test start time
        test_startTime = new Date();

        //initialize for testing
        err_msg='';    //temp single error message
        err_array=[];  //error message array
        output_msg='';  //temp single result return

        //setup QA logging
        require('fs').unlink(logFile, function(err){
            if(err){
                console.log('Remove file error or no ' + logFile + ' exist at all\n');
            }
        });
        logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({level: 'info'}),
                new (winston.transports.File)({
                    filename: logFile,
                    level: 'info',
                    maxsize: 10240,
                    maxFiles: 100,
                    json: false,
                    timestamp: false
                })
            ]
        });
        logger.info('Test started and logging at'+ logFile);
        //logger.extend(console); //log everything from console to logger(save to log file)

        //Protractor with Selenium WebdriverJS
        //var webdriver = require('selenium-webdriver');
/*        driver = new webdriver.Builder().
            usingServer(selenium_server).
            withCapabilities(webdriver.Capabilities.firefox()).build();
        driver.manage().timeouts().setScriptTimeout(120000);
        ptor = protractor.wrapDriver(driver);
*/
        //Protractor with wrapped Selenium WebdriverJS (internal)
        driver = new protractor.Builder().          //define driver instance for Selenium server used/wrapped with protractor
            usingServer(selenium_server).
            withCapabilities(
                protractor.Capabilities.firefox()
            ).
            build();
        driver.manage().timeouts().setScriptTimeout(120000);
        ptor = protractor.wrapDriver(driver);

        done1();

    });
//-------------------------------------------------------

    after(function(done2){
        async.series({
            end_webdriver: function(callback){
                //client.end(callback(null, 0));
                driver.quit().then(function(){
                    callback(null, 0);
                });
            },
            remove_logger: function(callback){
                logger.remove(winston.transports.Console);
                logger.remove(winston.transports.File);
                callback(null, 1);
            },
            remove_modules: function(callback){
                setTimeout(function(){
                    //calculate test elapse
                    test_endTime = new Date();
                    test_elapse = test_endTime - test_startTime;
                    console.log('Test elapsed=' + test_elapse);

                    //remove all loaded module before case exit
                    var cnt=0;
                    console.log('\nmodule key #' + Object.keys(require.cache).length);

                    async.whilst(
                        function(){ return cnt < Object.keys(require.cache).length; },
                        function(cb){
                            var key = Object.keys(require.cache).pop();
    //                            console.log('\ndeleted module:' + key);
                            delete require.cache[key];
                            cnt++;
                            setTimeout(cb, 20);
                        },
                        function(err){
                            if(err){ //the second #2 task/function found error
                                callback(err, 3);
                            }else{
                                callback(null, 3);
                            }
                        }
                    );
                }, 2000);
            }
        },function(err,results){
            if(err){
                console.log('\nError happened from the case afterEach block!\n');
            }
            //calculate test elapse
            test_endTime = new Date();
            test_elapse = test_endTime - test_startTime;
            console.log('Test elapsed=' + test_elapse);
            //
            done2();
        });
    });
//-------------------------------------------------------

    it('TC900: Protractor 1st case for AngularJS web page - check page title', function(done) {
        //trace HTTP call
        nock.recorder.rec();

        async.series([
            //wait for 1 sec
            function(callback){
                //special timeout here to make sure /vxmlappexit disconnect NEO NMSP client
                setTimeout(function(){
                    output_msg = '\nwait 1 second for server\n';
                    output_string += output_msg;
                    console.log(output_msg);

                    callback(null, 0);
                }, 1000);
            },
            function(callback){
                //start web test driver based on app driver session
                //set base agent web page URL
                ptor.driver.get(test_url).then(function(){
                    output_msg = '\nTest URL: ' + test_url;
                    output_string += output_msg;
                    console.log(output_msg);

                    var result = [test_url, 0];
                    callback(null, result);
                });

            },
            function(callback){
                ptor.getTitle().then(function(title){
                    output_msg = '\nweb page title: ' + title;
                    output_string += output_msg;
                    console.log(output_msg);

                    var result = [title, 0];
                    callback(null, result);
                })

            },
            function(callback){
                //
                setTimeout(function(){
                    output_msg = '\nwait 1 second for server\n';
                    output_string += output_msg;
                    console.log(output_msg);

                    callback(null, 3);
                }, 1500);
            }
        ],
        function(err, result){
            if(err){
                console.log('\n\nERROR found during agent web UI login. Quit!\n' + err + '\n\n');
                expect(err).to.have.length(0);
                done(err);

            }
            //using try & catch block to customize the output message if the case failed
            try{
                //
                console.log('for testing\n');
                expect(result[2][0]).to.match(/Google Phone Gallery:/);

                //log for post test check
                var pass_msg = '\nTest passed! ' + 'Output string:\n' + output_string;
                // pass_msg += '\n\nHttp server status code: ' + resReturn.statusCode + '\nHttp server body return: \n' + bodyReturn;
                logger.info(pass_msg);

                done();

            }catch(e){
                //log for post test check
                var fail_msg = '\nTest failed! ' + 'Error:\n' + JSON.stringify(e);
                fail_msg += '\n\nOutput string\n' + output_string;
                logger.info(fail_msg);
                //
                var fail_error = 'Test case ' + case_ID + ' failed! Please check case log for details';
                var err_ret = new ReferenceError(fail_error);
                done(err_ret);
            }
        });
    });
});