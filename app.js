(function() {
  var app = angular.module('doList', []);
  
  app.controller('DoListController', [ '$http', function($http) {
   this.curList = 0;
   var dolist = this;
   dolist.actions = [];
   dolist.contexts = [];
   dolist.projects = [];
   dolist.newAction = {};
   dolist.newAction.completed = false;

   dolist.actionOrderReverse = false
   //Tracks whether ascending or descending order last used for each action
   dolist.actionOrderReverseHistory = {};
  
   dolist.currentCollateProperty = "context"

//---------------Utility Functions-------------
   this.sort_by = function(field, reverse, primer){
     var key = primer ? 
         function(x) {return primer(x[field])} : 
         function(x) {return x[field]};
     reverse = [-1, 1][+!!reverse];
     return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
       } 
  };
        
  this.keepOnlyDayMonthYearInTimestamp = function(timestamp) {
    date = moment(timestamp);
    date.milliseconds(0)
    date.seconds(0)
    date.minutes(0)
    date.hours(0)
    simplifiedTimestamp = date.unix() * 1000;
    return simplifiedTimestamp;
  };



//---------------Sorting functions -------------
//sort actions (within categories... (but this isn't fully integrated yet!))
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

    this.sortDirectionToChar = function(category){
        if (this.actionOrderReverseHistory[category] === undefined){
            return "";}
        if (this.actionOrderReverseHistory[category] === false){
            return "(\u25B2)";}
        if (this.actionOrderReverseHistory[category] === true){
            return "(\u25BC)";}
    };

//---------------Collated headers-------------
// I think this could be done with angular: filter directive instead
// and using a "pattern object"
// Although.. that might actually be slower, because it will have to run the filter for every category, rather than have it compiled all at once, like here
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
      return  sortableEntries;
    }

  dolist.updateCollatedHeaders = function(){
     collatedHeaders = [];
     for (var key in dolist.collatedActions) {
         if (key != undefined)
         collatedHeaders.push(key);
     }
     return collatedHeaders;
}

   dolist.setHeader = function(headerName) {
      dolist.currentCollateProperty = headerName;
      dolist.collatedActions = dolist.updateCollatedEntries(headerName);
      dolist.collatedHeaders = dolist.updateCollatedHeaders();
    }

  dolist.displayActionHeader = function(actionHeader) {
   if (dolist.currentCollateProperty == "dateAdded") {
        date = moment(parseInt(actionHeader));
        return date.format("dddd, MMMM Do YYYY");
        }
   if (dolist.currentCollateProperty == "") {
        return "All";
    }
   if (dolist.currentCollateProperty == "completed") {
        return {true: "Completed", false: "Incomplete"}[actionHeader];
        }
    return actionHeader;
    }
  
  dolist.headerSelected = function(headerName) {
     return headerName == dolist.currentCollateProperty;
  }

  dolist.refreshList = function() {
    dolist.setHeader(dolist.currentCollateProperty);
    }

//---------------Selecting tabs at the top (old version)-------------
// the idea was to have completely seperate lists
  this.selectList = function(list){
    this.curList = list;
  };
  this.listSelected = function(list) {
    return this.curList === list;
  };

//---------------Basic Functionality  -------------

  this.addAction = function(list) {
    dolist.newAction.dateAdded = this.keepOnlyDayMonthYearInTimestamp(Date.now());
    dolist.actions.push(dolist.newAction);
    dolist.newAction = {};
    dolist.newAction.completed = false;
    dolist.refreshList();
  };
//---------------Actions & callback -------------
   this.sortActionsBy('dateAdded');
   this.sortActionsBy('dateAdded'); //doubled to reverse order, newest first

   $http.get('/dolist.json').success(function(data){
     dolist.actions  = data.actions;
     dolist.contexts  = data.contexts;
     dolist.projects  = data.projects;
     dolist.collatedActions = dolist.updateCollatedEntries(dolist.currentCollateProperty);
     dolist.collatedHeaders = dolist.updateCollatedHeaders();
    });

  }]);

})();

