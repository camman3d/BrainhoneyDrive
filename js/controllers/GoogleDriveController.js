function GoogleDriveController($scope) {
    var CLIENT_ID = '806237119008-ken1fjp9jpvqnocgirfpemsdprmkg4ct.apps.googleusercontent.com';
//    var CLIENT_ID = '925845354271.apps.googleusercontent.com'; // agilixapps@gmail.com
    var SCOPE = 'https://www.googleapis.com/auth/drive';
    var DRIVE_BASE_URL = '/drive/v2/';
    var user;

    $scope.authorized = false;
    $scope.authorize = function () {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPE, 'immediate': false},
            checkAuthorization
        );
    };
    $scope.items = [];
    $scope.loading = true;

    $scope.submit = function(item) {
        DLAP.submissionUrl = item.alternateLink;
        $("#confirmModal").modal("show");
    };

    // Get the user information from Google Drive
    function getUser(callback) {
        gapi.client.request({
            path: DRIVE_BASE_URL + 'about',
            method: 'GET'
        }).execute(function (result) {
                user = result.user;
                callback();
            });
    }

    // Get the user's items from Google Drive
    function listMyItems(callback) {
        gapi.client.request({
            path: DRIVE_BASE_URL + 'files',
            method: 'GET'
        }).execute(function (results) {
                $scope.items = results.items;
                $scope.loading = false;
                callback();
            });
    }

    // Check to see if we have access to Google Drive
    function checkAuthorization(authResult) {
        if (authResult && !authResult.error) {
            // Access token has been successfully retrieved, requests can be sent to the API.
            $scope.authorized = true;
            $scope.$apply();

            // Get the user
            getUser(function() {
                listMyItems(function () {
                    $scope.$apply();
                });
            });
        } else {
            // No access token could be retrieved, show the button to start the authorization flow.
            $scope.authorized = false;
            $scope.$apply();
        }

    }

    // Include the Google API
    window.handleClientLoad = function () {

        window.setTimeout(function () {

            // Check to see if we are authorized
            gapi.auth.authorize(
                {'client_id': CLIENT_ID, 'scope': SCOPE, 'immediate': true},
                checkAuthorization
            );
        }, 1);
    };
    $.getScript("https://apis.google.com/js/client.js?onload=handleClientLoad");
}