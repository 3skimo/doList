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
  


   dolist.sort_by = function(field, reverse, primer){

     var key = primer ? 
         function(x) {return primer(x[field])} : 
         function(x) {return x[field]};

     reverse = [-1, 1][+!!reverse];

     return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
       } 
  };

        

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

   dolist.currentCollateProperty = "context"
   dolist.updateCollatedEntries = function(collateProperty) {
      sortedList = dolist.actions.sort(dolist.sort_by(collateProperty, false, function(a){return a}));
      sortableEntries = {};
      for (action in sortedList){
          theAction = sortedList[action];
          theHeader = theAction[collateProperty];
          
          if (sortableEntries.hasOwnProperty(theHeader)) {    
              sortableEntries[theHeader].push(theAction);
          }
          else
              sortableEntries[theHeader] = [theAction]; 

      }

      returcription":"Trim hedge","context":"Garden","project":"Errands","dateAdded":1415433318880},{"description":"Mow lawn","context":"Garden","project":"Errands","dateAdded":1415433318880}],"context":"teh"}
 sortableEntries;
    }

   $http.get('/dolist.json').success(function(data){
     dolist.actions  = data.actions;
     dolist.contexts  = data.contexts;
     dolist.projects  = data.projects;
     dolist.collatedActions = dolist.updateCollatedEntries(dolist.currentCollateProperty);
    });


   
   dolist.sortActionsBy('dateAdded');
   dolist.sortActionsBy('dateAdded'); //doubled to reverse order, newest first

   //dolist.sortedList = dolist.actions; //.sort(dolist.sort_by(dolist.currentSortable, false, function(a){return a.toUpperCase}));

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

