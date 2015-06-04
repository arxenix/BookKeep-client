angular.module('starter.controllers', ['ngCordova'])




/* Home Tab*/
.controller('HomeCtrl', function($scope, $http) {
  $scope.$on('$ionicView.enter', function() {    
    //clear variables
    $scope.error = null;
    $scope.numBooks = null;
    
    $http.get('https://bookdb-bobacadodl.c9.io/test.php').
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously

      if(data.error) {
        $scope.error = data.error;
        console.log("error returned - "+data.error);
      }
      else {
        $scope.numBooks = data.numBooks;
      }
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      console.log("GET ERROR- data="+data+", status="+status+", headers="+headers);
    });
  });
})




/* Check in Tab */
.controller('CheckInCtrl', function($scope, $http, $cordovaBarcodeScanner) {

  /* Use CordovaBarcodeScanner to scan the barcode */
  $scope.scanBarcode = function() {
    
    $scope.error = null;
    
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        
        if(!imageData.cancelled && imageData.text) {
          $scope.book = imageData.text;
          $scope.checkin($scope.book);
        }
      }, function(error) {
        console.log("ERROR - " + error);
      });
  };
  
  
  /*  Check books in after getting barcode       */
  $scope.checkin = function(book) {
    //send request to check it in
    $http.get('https://bookdb-bobacadodl.c9.io/check_in.php', {
      params: {
        book: book
      }
    }).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously

      if(data.error) {
        $scope.error = data.error;
        console.log("error returned - "+data.error);
      }
      else {
        alert("Successfully checked in book!");
        $scope.book = null;
      }
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      console.log("GET ERROR- data="+data+", status="+status+", headers="+headers);
    });
  };
})



/* Check Out Tab */
.controller('CheckOutCtrl', function($scope, $http, $cordovaBarcodeScanner) {
  
  /* Scan Barcode */
  $scope.scanBarcode = function() {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        
        if(!imageData.cancelled && imageData.text) {
          $scope.book = imageData.text;
        }
      }, function(error) {
        console.log("ERROR - " + error);
      });
  };
  
  
  /* Check out a book, making sure barcode is scanned and ID is entered */
  $scope.checkout = function(id) {
    $scope.error = null;
    
    if($scope.book) {
      if(!isNaN(id)) {
        $http.get('https://bookdb-bobacadodl.c9.io/check_out.php', {
          params: {
            id: id,
            book: $scope.book
          }
        }).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously

          if(data.error) {
            $scope.error = data.error;
            console.log("error returned - "+data.error);
          }
          else {
            alert("Successfully checked out book!");
            $scope.book = null;
            $scope.id = null;
          }
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          console.log("GET ERROR- data="+data+", status="+status+", headers="+headers);
        });
      }
      else {
        $scope.error = "Invalid ID";
      }
    }
    else {
      $scope.error = "Scan a barcode first!";
    }
    
  };
})




/* Search Tab */
.controller('SearchCtrl', function($scope, $http) {
  
  /* Search for books matching student ID */
  $scope.search = function(id) {
    
    console.log("Searching for books for ID="+id);
    
    //clear error
    $scope.error = null;
    
    $scope.searchId = null;
    
    //clear books
    $scope.books = null;    
    
    if(!isNaN(id)) {
      //send GET request to server
      $http.get('https://bookdb-bobacadodl.c9.io/search.php', {
        params: {
          id: id
        }
      }).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously

        if(data.error) {
          $scope.error = data.error;
          console.log("error returned - "+data.error);
        }
        else {
          //set books variable
          $scope.books = data.books;
          $scope.searchId = id;
        }
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        console.log("GET ERROR- data="+data+", status="+status+", headers="+headers);
      });
    }
    else {
      $scope.error = "Invalid ID";
    }
  };
  
  
  /* Check in a book */
  $scope.checkin = function(book) {
    console.log("Checking in book-"+book);
    $http.get('https://bookdb-bobacadodl.c9.io/check_in.php', {
      params: {
        book: book
      }
    }).
    success(function(data, status, headers, config) {
      // this callback will be called asynchronously

      if(data.error) {
        $scope.error = data.error;
        console.log("error returned - "+data.error);
      }
      else {
        alert("Successfully checked in book!");
        
        $scope.search($scope.searchId);
      }
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      console.log("GET ERROR- data="+data+", status="+status+", headers="+headers);
    });
  };
});
