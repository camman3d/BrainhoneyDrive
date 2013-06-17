function DocumentSubmitController($scope) {
    $scope.enrollmentsLoaded = false;
    $scope.enrollments = [];
    $scope.itemsLoaded = false;
    $scope.itemsLoading = false;
    $scope.items = [];
    $scope.item = null;
    $scope.noItems = false;

    $("#confirmModal").on("show", function() {
        if (!$scope.enrollmentsLoaded && !$scope.enrollments.length) {
            // Load the enrollment
            DLAP.api.getEnrollments(function (enrollments) {
                $scope.enrollments = enrollments;
                $scope.enrollmentsLoaded = true;
                $scope.$apply();
            });
        }
    });

    $scope.selectCourse = function() {
        $scope.noItems = false;
        $scope.itemsLoading = true;
        $scope.itemsLoaded = false;
        $scope.item = null;
        $("#submitButton").addClass("disabled");

        DLAP.api.getItems($scope.course.entityid, function (items) {
            $scope.items = DLAP.itemFilters.dropboxURL(items);
            $scope.noItems = !$scope.items.length;
            $scope.itemsLoading = false;
            $scope.itemsLoaded = true;
            $scope.$apply();
        });
    };

    $scope.selectItem = function(item) {
        $scope.item = item;
        $("#submitButton").removeClass("disabled");
    };

    $scope.submit = function() {
        if($scope.item) {
            // TODO: Possibly share the document so the teacher can see it

            // Get the enrollment id
            var enrollmentId = $scope.course.id;
            DLAP.api.submitURL(enrollmentId, $scope.item.id, DLAP.submissionUrl, function() {
                $("#confirmModal").modal("hide");
            });
        }
    };

}