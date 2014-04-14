app.controller("settingsController", function($scope, $location, $route, $rootScope, loginFactory){

	$scope.user = {name: ''};
	$scope.updateButtonStatus = 'Update';
	$scope.deleteButtonStatus = 'Delete and sign out';

	$scope.init = function() {
		$('.header h1').html("Settings");
		loginFactory.getUserInfo(function(err, data) {
			if(err) {
				alert(err);
			}else{
				if(data) {
					$scope.user = data;
					if(data.likeMen === 1) $('#checkboxMen').attr('checked', 'true');
					if(data.likeWomen === 1) $('#checkboxWomen').attr('checked', 'true');
					$scope.pictures.push({ url: data.picture });
				}
			}
		});
	};

	$scope.pictures = [];

	$scope.selectPicture = function() {
		window.imagePicker.getPictures(
			function(results) {
				for (var i = 0; i < results.length; i++) {
//					$('#images').append('<img src="'+results[i]+'">');
					$scope.pictures.push({ url: results[i] });
					$scope.$apply();
				}
			}, function (error) {
				console.log('Error: ' + error);
			}, {
				maximumImagesCount: 4 - $scope.pictures.length,
				width: 300
			}
		);
	};

	$scope.removePicture = function(index) {
		$scope.pictures.splice(index, 1);
		$scope.$apply;
	};

	$scope.selectPictureSuccess = function(imageUrl) {
    if(imageUrl.indexOf('content://') != -1 && imageUrl.indexOf("%3A") != -1){
      photo_split=imageUrl.split("%3A");
    	imageUrl="content://media/external/images/media/"+photo_split[1];
    }

    var fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
    var extension;

    if (imageUrl.indexOf('content://') != -1) {
      if(imageUrl.lastIndexOf('.') > imageUrl.lastIndexOf('/')){
        extension = imageUrl.substr(imageUrl.lastIndexOf('.') + 1);
      }else{
        extension = "jpg";
      	fileName = fileName + ".jpg";
      }
    } else {
      if (imageUrl.lastIndexOf('.') == -1 || (imageUrl.lastIndexOf('.') < imageUrl.lastIndexOf('/')) ) {
      	extension = "invalid";
      } else {
        extension = imageUrl.substr(imageUrl.lastIndexOf('.') + 1);
      }
    }

		var image = document.getElementById('myImage');
		image.src = imageUrl;

/*		var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageUrl.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";

    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(imageUrl, "http://192.168.10.61:8080/upload.php", win, fail, options);*/
	};

	$scope.update = function() {
		$scope.updateButtonStatus = 'Updating..';

		var formData = $('#settingsForm').serializeArray();
		loginFactory.updateUserInfo(formData, function(err, data) {
			$scope.updateButtonStatus = 'Update';
			if(err) {
				alert(err);
			}else{
				if(data.status === '200') {
					navigator.notification.alert('Your settings were successfully saved.', function(){return;}, 'Saved!');
				}else{
					navigator.notification.alert('Our server didn\'t accept your request.', function(){return;}, 'Uhoh..');
				}
			}
		});
	}

	$scope.deleteAccount = function() {
		$scope.deleteButtonStatus = 'Deleting..';

		loginFactory.deleteAccount(function(err, data){

			if(!err) {
				if(data.status !== '200') {
					$scope.deleteButtonStatus = 'Delete and sign out';
					navigator.notification.alert('Something went wrong while deleting your account from our database.', function(){return;}, 'Error');
				}else{
					$scope.deleteButtonStatus = 'Deleted';
					navigator.notification.alert('Your account was successfully deleted.', function(){return;}, 'Deleted!');
					loginFactory.loggedIn = 0;
					loginFactory.logOut();
				}
			}else{
				alert(err);
			}
		});
	}

});
