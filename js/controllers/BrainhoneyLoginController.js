var brainhoneyLoginCallback = null;

function BrainhoneyLoginController($scope) {
    $scope.endpoint = "";
    $scope.password = "";

    $scope.login = function() {
        var nameParts = $scope.name.split("/");
        DLAP.endpointURL = $scope.endpoint || DLAP.endpointURL;
        DLAP.api.authenticate(nameParts[0], nameParts[1], $scope.password, function() {
            // We logged in
            $("#loginModal").modal("hide");

            // Pass the credentials to the callback
            if (brainhoneyLoginCallback) {
                brainhoneyLoginCallback(nameParts[0], nameParts[1], $scope.password);
            }
        });
    }
}