function BrainhoneyLoginController($scope) {
    $scope.endpoint = "";
    $scope.password = "";

    $("#loginModal").modal("show");
    $scope.login = function() {
        var nameParts = $scope.name.split("/");
        DLAP.endpointURL = $scope.endpoint || DLAP.endpointURL;
        DLAP.api.authenticate(nameParts[0], nameParts[1], $scope.password, function() {
            // We logged in
            $("#loginModal").modal("hide");
        });
    }
}