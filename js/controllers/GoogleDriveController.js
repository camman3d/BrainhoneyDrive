function GoogleDriveController($scope) {


    var driveBaseUrl = '/drive/v2/';
//    var user;

    $scope.authorized = false;
    $scope.authorize = function () {
        GoogleAuthLoader.authorize(authenticated, function(){});
    };
    $scope.items = [];
    $scope.loading = true;

    $scope.submit = function (item) {
        DLAP.submissionUrl = item.alternateLink;
        $("#confirmModal").modal("show");
    };

    // Get the user information from Google Drive
//    function getUser(callback) {
//        gapi.client.request({
//            path: driveBaseUrl + 'about',
//            method: 'GET'
//        }).execute(function (result) {
//                user = result.user;
//                callback();
//            });
//    }

    // Get the user's items from Google Drive
    function loadItems() {
        var request = gapi.client.request({
            path: driveBaseUrl + 'files',
            method: 'GET'
        });
        request.execute(function (results) {

            // Make sure that we don't show the login data
            $scope.items = results.items.filter(function(item) {
                return item.title !== "Brainhoney Login Data";
            });

            $scope.loading = false;
            $scope.$apply();
        });
    }

    function brainhoneyLoginPrompt() {
        $("#loginModal").modal("show");
        brainhoneyLoginCallback = function (domain, username, password) {
            var data = {
                endpoint: DLAP.endpointURL,
                domain: domain,
                username: username,
                password: password
            };
            GoogleDriveFileUploader.uploadString(JSON.stringify(data), "Brainhoney Login Data");
        };
    }

    function authenticated() {
        $scope.authorized = true;
        $scope.$apply();

        // Load the user's docs
        loadItems();

        // Get Brainhoney login info
        AppDataLoader.getAppData(
            function (data) {
                // We have the data. Now log in
                DLAP.endpointURL = data.endpoint;
                DLAP.api.authenticate(data.domain, data.username, data.password, function() {
                    console.log("Logged in!");
                });
            },
            brainhoneyLoginPrompt
        );
    }

    // Start the authentication process
    GoogleAuthLoader.init(authenticated, function(){});
}