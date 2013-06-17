var DLAP = (function () {

//    var endpointURL = "http://gls.agilix.com/dlap.ashx";
    var endpointURL = "http://brighton.agilix.com/dlap.ashx";
    var userid = "";
    var token = "";

    function checkResponseCode(data, callback, error) {
        var code = data.childNodes[0].getAttribute("code");
        if (code === "OK") {
            callback && callback();
        } else {
            error && error(code)
        }
    }

    function authenticate(prefix, username, password, callback) {
        $.ajax({
            url: endpointURL,
            type: "post",
            data: {
                cmd: "login",
                username: prefix + "/" + username,
                password: password
            },
            success: function (data) {
                checkResponseCode(data,
                    function () {
                        // Save information
                        var user = data.getElementsByTagName("user")[0];
                        token = user.getAttribute("token");
                        userid = user.getAttribute("userid");
                        callback();
                    }, function (code) {
                        alert("Error authenticating. " + code);
                    }
                );
            }
        });
    }

    function getEnrollments(callback) {
        $.ajax({
            url: endpointURL + "?cmd=getuserenrollmentlist2&userid=" + userid + "&_token=" + token,
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                var enrollments = data.response.enrollments.enrollment;
                callback(enrollments);
            }
        })
    }

    function getItems(enrollmentId, callback) {
        $.ajax({
            url: endpointURL + "?cmd=getitemlist&entityid=" + enrollmentId + "&_token=" + token,
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                var items = data.response.items.item;
                callback(items);
            }
        })
    }

    function submitURL(entityId, itemId, URL, callback) {
        var data = {
            submission: {
                type: "assignment",
                url: {
                    $value: URL
                }
            }
        };
        $.ajax({
            url: endpointURL + "?cmd=putstudentsubmission&enrollmentid=" + entityId + "&itemid=" + itemId + "&_token=" + token,
            type: "post",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                checkResponseCode(data,
                    function () {
                        callback();
                    }, function (code) {
                        alert("Error submitting URL. " + code);
                    }
                );
            }
        })
    }

    var dlap = {
        api: {
            authenticate: authenticate,
            getEnrollments: getEnrollments,
            getItems: getItems,
            submitURL: submitURL
        },
        itemFilters: {
            assignment: function (items) {
                return items.filter(function (item) {
                    return item.data.type && item.data.type.$value === "Assignment";
                });
            },
            dropboxURL: function (items) {
                return items.filter(function (item) {
                    return item.data.dropbox && item.data.dropbox.$value && item.data.dropboxtype && item.data.dropboxtype.$value === 4;
                })
            }
        }
    };
    Object.defineProperty(dlap, "endpointURL", {
        get: function() {
            return endpointURL;
        },
        set: function (value) {
            endpointURL = value;
        }
    });
    return dlap;
}());