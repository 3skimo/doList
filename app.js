(function() {
  var app = angular.module('doList', []);

  app.controller('DoListController', [ '$http', function($http) {
   this.curList = 0;
   var dolist = this;
   dolist.actions = [];
   dolist.contexts = [];
   dolist.projects = [];
   dolist.newAction = {};

   dolist.actionOrderReverse = false
   //Tracks whether ascending or descending order last used for each action
   dolist.actionOrderReverseHistory = {};
    
   $http.get('/dolist.json').success(function(data){
     dolist.actions  = data.actions;
     dolist.contexts  = data.contexts;
     dolist.projects  = data.projects;
    });

   this.sortActionsBy = function(category) {
    if (dolist.actionOrderReverseHistory[category] === undefined) {
       this.actionOrderReverseHistory[category] = false;
        }
    else if (this.actionOrder == category){
        this.actionOrderReverseHistory[category] = !this.actionOrderReverseHistory[category];
        }
    this.actionOrderReverse = this.actionOrderReverseHistory[category];
    this.actionOrder=category;
  };


   dolist.sortActionsBy('dateAdded');
   dolist.sortActionsBy('dateAdded'); //doubled to reverse order, newest first

    this.sortDirectionToChar = function(category){
        if (this.actionOrderReverseHistory[category] === undefined){
            return "";}
        if (this.actionOrderReverseHistory[category] === false){
            return "(\u25B2)";}
        if (this.actionOrderReverseHistory[category] === true){
            return "(\u25BC)";}
    };

  this.selectList = function(list){
    this.curList = list;
  };
  this.listSelected = function(list) {
    return this.curList === list;
  };
  this.addAction = function(list) {
    dolist.newAction.dateAdded = Date.now();
    dolist.actions.push(dolist.newAction);
    dolist.newAction = {};
  }
  }]);
})();

