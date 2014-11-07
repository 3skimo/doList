(function() {
  var app = angular.module('doList', []);

  app.controller('DoListController', [ '$http', function($http) {
   this.curList = 0;
   var dolist = this;
   dolist.actions = [];
   dolist.contexts = [];
   dolist.projects = [];
   dolist.newAction = {};
   dolist.productOrder = "name";
   $http.get('/dolist.json').success(function(data){
     dolist.actions  = data.actions;
     dolist.contexts  = data.contexts;
     dolist.projects  = data.projects;
    });
   this.sortProducts = function(category) {
    store.productOrder=category;
  };
  this.selectList = function(list){
    this.curList = list;
  };
  this.listSelected = function(list) {
    return this.curList === list;
  };
  this.addAction = function(list) {
    dolist.actions.push(dolist.newAction);
    dolist.newAction = {};
  }
  }]);
})();

