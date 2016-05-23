var app = angular.module('app',['ngRoute', 'ngStorage']);


app.config(['$routeProvider',function($routeProvider, $location,$rootScope){
	

$routeProvider.
	when('/',{controller:'homeController', templateUrl:'home.html'}).
	when('/ligas',{controller:'ligasController',templateUrl:'ligas.html'}).
    when('/login',{controller:'loginController',templateUrl:'login.html'}).
	otherwise({redirectTo:'/'});



	
}]);

app.controller('homeController', function ($scope,$http) {
	console.log('home');
	
	
});

app.controller('loginController', function ($scope,$http, $localStorage, $location, $rootScope) {
	$scope.efetuaLogin= function(){

		$http.post(
			'https://login.globo.com/api/authentication',
			{
				  payload:{
					  email: $scope.email,
					  password:  $scope.senha,
					  serviceId: 4728
				  }
						
			}
		).then(function(response){
			console.log( response.data );
			$localStorage.token=response.data.glbId;
			$localStorage.logado=true;
			$rootScope.logado=$localStorage.logado;
			
			//$('div#navcol-1').removeClass('in');
			$location.path('/');
			
			
			
		});
	}
	
	
	
});





app.run(['$rootScope',function($rootScope, $localStorage, $location,$routeParams ){
	
	
	$rootScope.$on('$routeChangeSuccess', function () {
		console.log( 'mudou' );
    });
	console.log('app.run');
	

	
	 

}]);


