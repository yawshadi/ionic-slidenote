// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db=null;
angular.module('starter', ['ionic','ngCordova','starter.controllers'])

.run(function($ionicPlatform,$cordovaSQLite,$cordovaToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
   if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.cordova) {
              //db = $cordovaSQLite.openDB({ name: "Asset.db", location: 'default' }); //device
              if(window.cordova=="Android"){
                    // Works on android but not in iOS
                    db = $cordovaSQLite.openDB({ name: "slidenote.db", iosDatabaseLocation:'default'}); 
                  } else{
                    // Works on iOS 
                    db = window.sqlitePlugin.openDatabase({ name: "slidenote.db", location: 2, createFromLocation: 1}); 
                    }
            }else{
              db = window.openDatabase("slidenote.db", '1', 'my','2000'); // browser
            }
              $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS notes (id integer primary key, subject text,message text,messageDate text)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.read', {
    url: '/read/:noteid',
    views: {
      'menuContent': {
        templateUrl: 'templates/read.html',
        controller: 'ReadCtrl'
      }
    }
  })

  .state('app.notes', {
      url: '/notes',
      views: {
        'menuContent': {
          templateUrl: 'templates/notes.html',
           controller: 'HomeCtrl'
        }
      }
    })
    .state('app.new', {
      url: '/new',
      views: {
        'menuContent': {
          templateUrl: 'templates/new.html',
           controller: 'NewCtrl'
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.controller('NewCtrl', function($scope,$cordovaSQLite,$cordovaToast,$location) {
  var newdate= new Date();
  newdate= newdate.getFullYear() + '-' + ('0' + (newdate.getMonth() + 1)).slice(-2) + '-' + ('0' + newdate.getDate()).slice(-2);
  $scope.$on('$stateChangeSuccess', function () {
   $scope.save = function(note) {
        var query = "INSERT INTO notes (subject,message,messageDate) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [note.subject,note.msg,newdate]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
             $cordovaToast.showShortBottom('Note Successfully Saved').then(function(success) {
                $location.path('/app/home');
              }, function (error) {
                // error
              });
        }, function (err) {
            console.error(err);
        });
      
    }
})
})

.controller('HomeCtrl', function($scope,$cordovaSQLite) {
  
  $scope.$on('$stateChangeSuccess', function () {
    
 $scope.alldata=[];
        var query = "SELECT * FROM notes order by id desc";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
               for(var i=0;i< res.rows.length;i++){
                 $scope.alldata.push(res.rows.item(i))
                 
               }
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
});
})
/*
.controller('NotesCtrl', function($scope,$cordovaSQLite) {
  
  $scope.$on('$stateChangeSuccess', function () {
    
 $scope.alldata=[];
        var query = "SELECT * FROM notes order by id desc";
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
               for(var i=0;i< res.rows.length;i++){
                 $scope.alldata.push(res.rows.item(i))
                 
               }
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
});
})*/
.controller('ReadCtrl', function($scope, $stateParams,$cordovaSQLite) {
  
  var id = $stateParams.noteid;
  $scope.finddata=[];
        var query = "SELECT * FROM notes where id=?";
        $cordovaSQLite.execute(db, query,[id]).then(function(res) {
            if(res.rows.length > 0) {
               for(var i=0;i< res.rows.length;i++){
                 $scope.finddata.push(res.rows.item(i))
                 
               }
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });
  
});
