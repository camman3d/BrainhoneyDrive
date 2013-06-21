/**
 * Created with IntelliJ IDEA.
 * User: josh
 * Date: 6/21/13
 * Time: 4:07 PM
 * To change this template use File | Settings | File Templates.
 */
var GoogleAuthLoader = (function() {

    var config = {
        clientId: '806237119008-hap4429omsridlrtr79sqpgl2fn7ah78.apps.googleusercontent.com', // www.joshmonson.com
        scopes: [
            'https://www.googleapis.com/auth/drive', // View all files
            'https://www.googleapis.com/auth/drive.appdata' // Save application data
        ],
        appId: 806237119008,
        apiKey: "AIzaSyBsXJmkqgo9UKmkqjJoQ2rZF2JD7nA8keE"
    };

    // Check to see if we have access to Google Drive
    function checkAuthorization(authResult, success, error) {
        if (authResult && !authResult.error) {

            // Load the drive library
            gapi.client.load("drive", "v2", function () {

                success();
            });
        } else {
            // No access token could be retrieved, show the button to start the authorization flow.
            error();
        }

    }

    function init(success, error) {
        // First load the Google JS API
        // See here: https://developers.google.com/api-client-library/javascript/start/start-js
        $.getScript("https://apis.google.com/js/client.js", function () {

            // Load the client library
            gapi.load('auth:client', function () {

                // Set the API key
                gapi.client.setApiKey(config.apiKey);

                // Attempt to authorize
                window.setTimeout(function () {
                    var params = {
                        client_id: config.clientId,
                        scope: config.scopes,
                        immediate: true
                    };
                    gapi.auth.authorize(params, function (authResult) {
                        checkAuthorization(authResult, success, error);
                    });
                }, 1);
            })
        });
    }

    function authorize(success, error) {
        var params = {
            client_id: config.clientId,
            scope: config.scopes,
            immediate: false
        };
        gapi.auth.authorize(params, function (authResult) {
            checkAuthorization(authResult, success, error);
        });
    }

    return {
        init: init,
        authorize: authorize
    };
})();