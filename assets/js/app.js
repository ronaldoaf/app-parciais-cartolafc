var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);


var app = angular.module('app',['ngRoute', 'ngStorage', 'underscore']);
//https://api.cartolafc.globo.com/atletas/pontuados

app.config(['$routeProvider',function($routeProvider, $location,$rootScope){
	

$routeProvider.
	when('/',{controller:'homeController', templateUrl:'home.html'}).
	when('/ligas',{controller:'ligasController',templateUrl:'ligas.html'}).
    when('/login',{controller:'loginController',templateUrl:'login.html'}).
	when('/times_liga/:slug',{controller:'times_ligaController',templateUrl:'times_liga.html'}).
	otherwise({redirectTo:'/'});



	
}]);



//https://api.cartolafc.globo.com/auth/liga/prodesp-coaching-smart
app.controller('mainController', function ($routeParams,$rootScope,$scope,$http,$localStorage,$routeParams, _ ) {
	$localStorage.times_selecionados= $localStorage.times_selecionados || [];
	
	
	
	$rootScope.atualizaJogadoresDoMercado=function(){
		$http.get(
			'https://api.cartolafc.globo.com/atletas/mercado',
			{
				  headers:{
					  'X-GLB-Token': $localStorage.token
				  }
						
			}

		).then(function(response){
			//console.log(response.data.atletas);
			$rootScope.mercado=response.data;
		},function(response){
			console.log('Deu erro acessar o mercado');
			console.log(response);
		});
	
	}
	
	
	
	$rootScope.atualizaJogadoresPontuados=function(){
		$http.get(
			'https://api.cartolafc.globo.com/atletas/pontuados',
			{
				  headers:{
					  'X-GLB-Token': $localStorage.token
				  }
						
			}

		).then(function(response){
			//console.log(response.data.atletas);
			$rootScope.pontuados=response.data;
			$rootScope.parciais_ativas=true;
			
		},function(response){
			if (response.status==404){
				$rootScope.atualizaJogadoresDoMercado();
				$rootScope.parciais_ativas=false;
			}
		});
		

	};
	
	
	$rootScope.atualizaJogadoresPontuados();
	
	$rootScope.$watch('pontuados', function() {
        $localStorage.pontuados=$rootScope.pontuados;
    });
	$rootScope.$watch('mercado', function() {
        $localStorage.mercado=$rootScope.mercado;
    });
	

});
	




















app.controller('homeController', function ($scope,$http, $localStorage, _) {
	//$localStorage.times_selecionados= $localStorage.times_selecionados || [];
	$localStorage.times_home = $localStorage.times_home.push || [];
	
	$scope.times_home = $localStorage.times_home;

	$scope.getTime=function(time_slug){
		
		
		$http.get(
			'https://api.cartolafc.globo.com/time/'+time_slug,
			{
				  headers:{
					  'X-GLB-Token': $localStorage.token
				  }
						
			}

		).then(function(response){
			//console.log(response.data.atletas);
			$scope.times_home.push(response.data);
			
			
		},function(response){
			console.log('Deu ao acessar o time '+time_slug);
			console.log(response);
		});		
		
		return data_time;
	};
	
	
	//$scope.times_selecionados=$localStorage.times_selecionados;
	_.each($localStorage.times_selecionados,function(time_slug){
		console.log($scope.getTime(time_slug) )
		
	})
	
	
	
});

app.controller('ligasController', function ($scope,$http,$localStorage) {
	
	$scope.somenteLigasDeUsuarios = function(liga) {
	  return liga.time_dono_id !==null ? true : false;
	};
	
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
app.controller('times_ligaController', function ($routeParams,$rootScope,$scope,$http,$localStorage,$routeParams, _ ) {

		
		$scope.times_selecionados={};
		_.each($localStorage.times_selecionados, function(time){
			$scope.times_selecionados[time]=true;		
		});
		
		
		$rootScope.adicionaTimeNaLista=function(time_slug){
			if ( !_.contains( $localStorage.times_selecionados, time_slug) ) {
				$localStorage.times_selecionados.push(time_slug);		
			} else{
				$localStorage.times_selecionados.splice( $localStorage.times_selecionados.indexOf(time_slug) )			
			}
			
			$scope.times_selecionados[time_slug]=!$scope.times_selecionados[time_slug];
		}
		
		
		
		$scope.listaTimesDaLiga=function(num_pagina){
			$http.get(
				'https://api.cartolafc.globo.com/auth/liga/'+$routeParams.slug +'?orderBy=campeonato&page='+num_pagina,
				{
					  headers:{
						  'X-GLB-Token': $localStorage.token
					  }
							
				}

			).then(function(response){
				console.log(response.data.times);
				
				if (num_pagina==1) $scope.times=[];
				//angular.extend($scope.times, response.data.times);
				$scope.times=$scope.times.concat(response.data.times);
				
				if ( response.data.liga.total_times_liga/20 > num_pagina) {
					$scope.listaTimesDaLiga(num_pagina+1);					
				}
				
				
			});
			
	
		};
		
		
		
		$scope.listaTimesDaLiga(1);
		
	

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
	$rootScope.times_selecionados=[];
	
	
});





app.run(['$rootScope',function($rootScope, $localStorage, $location,$routeParams){
	
	console.log($localStorage);
	
	//$localStorage.times_selecionados = [];
	

	
	
	/*
	$rootScope.$on('$routeChangeSuccess', function () {
		console.log( 'mudou' );
    });
	
	*/
	console.log('app.run');
	
	
	
	 

}]);


