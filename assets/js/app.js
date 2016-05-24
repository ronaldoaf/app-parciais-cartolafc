var app = angular.module('app',['ngRoute', 'ngStorage']);


app.config(['$routeProvider',function($routeProvider, $location,$rootScope){
	

$routeProvider.
	when('/',{controller:'homeController', templateUrl:'home.html'}).
	when('/ligas',{controller:'ligasController',templateUrl:'ligas.html'}).
    when('/login',{controller:'loginController',templateUrl:'login.html'}).
	when('/times_liga/:slug',{controller:'times_ligaController',templateUrl:'times_liga.html'}).
	otherwise({redirectTo:'/'});



	
}]);

app.controller('homeController', function ($scope,$http) {
	console.log('home');
	
	
});

app.controller('ligasController', function ($scope,$http,$localStorage) {
	console.log('ligas');
	
		$http.get(
			'https://api.cartolafc.globo.com/auth/ligas',
			{
				  headers:{
					  'X-GLB-Token': $localStorage.token
				  }
						
			}
		).then(function(response){
			$scope.ligas=response.data.ligas;
			console.log(response.data.ligas);
			
		});
	
});
	//https://api.cartolafc.globo.com/auth/liga/prodesp-coaching-smart
app.controller('times_ligaController', function ($routeParams,$scope,$http,$localStorage,$routeParams) {
	console.log('ligas');
	
		$http.get(
			'https://api.cartolafc.globo.com/auth/liga/'+$routeParams.slug,
			{
				  headers:{
					  'X-GLB-Token': $localStorage.token
				  }
						
			}
		).then(function(response){
			$scope.times=response.data.times;
			console.log($scope.times);
			
		});
	
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


