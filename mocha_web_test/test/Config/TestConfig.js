//Global Mocha + protractor + webdriverjs + selenium test parameters/variables settings
exports.options = {
//  server            : "10.3.41.54",             	//test server host IP/name

//	port              : 80,                             //default http website port
//  port              : 8080,                           //default user customized app port
	port              : 443,                            //default https website port
	test_location     : "/",      //test base folder

	test_Url          : "https://angularjs.org/", 				//for public web side sample testing
//	test_Url          : "https://hello-world-ghu21st.c9.io/", 	//for user customized nodejs app testing 
   
	selenium_server   : "http://localhost:4444/wd/hub",    		//selenium server URL
//  browser_driver    : "firefox",            //config browser driver to "firefox". NOTE: need to start selenium standalone server + Firefox driver first (or batch file)
	browser_driver    : "chrome",            //config browser driver to "chrome". NOTE: need to start selenium standalone server + Chrome driver first (or batch file)
 
	ptor_timeout_regression : 60000,                     // protractor driver & script time out
  
};
