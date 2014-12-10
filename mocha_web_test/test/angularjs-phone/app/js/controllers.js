'use strict';

/* Controllers */

// --- Test 10 above...
var phonecatControllers = angular.module('phonecatControllers',[]);

phonecatControllers.controller('PhoneListCtrl', ['$scope','PhoneHttp', function($scope, PhoneHttp){
    $scope.phones = PhoneHttp.query();
    $scope.orderProp = 'age';

}]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope','$routeParams','PhoneHttp',function($scope, $routeParams, PhoneHttp){
    $scope.phone = PhoneHttp.get({phoneId: $routeParams.phoneId}, function(phone){
        $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl){
        $scope.mainImageUrl = imageUrl;
    };

    //add new controller method
    $scope.hello = function(name){
        alert('Hello ' + (name || 'world') + '!');

    };
}]);

/* ---- Test step 4 -----

var phonecatApp = angular.module('phonecatApp', []);
phonecatApp.controller('PhoneListCtrl', function($scope){
    $scope.phones = [
        {'name': 'Nexus S',
         'snippet': 'Fast just got faster with Nexus S.',
         'age': 1},
        {'name': 'Motorola XOOM with Wi-Fi',
         'snippet': 'The next generation tablet.',
         'age': 2},
        {'name': 'Motorolar XOOM',
         'snippet': 'The next generation tablet.',
         'age': 3}
    ];

    //$scope.name = 'world';
    $scope.orderProp = 'age';
});
*/

/*
//--- Test step 5 ---- **************
 var phonecatApp = angular.module('phonecatApp', []);

 phonecatApp.controller('PhoneListCtrl', function($scope, $http){
 $http.get('phones/phones.json').success(function(data){
 $scope.phones = data;
 });

 $scope.orderProp = 'age';

 });

*/
/*
//--- Test step 7 ----
phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', function($scope, $routeParams){
    $scope.phoneId = $routeParams.phoneId;

}]);
*/
/*
//--- Test step 8 -----
phonecatControllers.controller('PhoneDetailCtrl', ['$scope','$routeParams','$http',function($scope, $routeParams, $http){
    $http.get('phones/' + $routeParams.phoneId + '.json').success(function(data){
        $scope.phone = data;
        $scope.mainImageUrl = data.images[0];
    });

    $scope.setImage = function(imageUrl){
        $scope.mainImageUrl = imageUrl;
    };

    //add new controller method
    $scope.hello = function(name){
        alert('Hello ' + (name || 'world') + '!');

    };
}]);
*/

