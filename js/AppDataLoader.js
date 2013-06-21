/**
 * Created with IntelliJ IDEA.
 * User: josh
 * Date: 6/21/13
 * Time: 4:17 PM
 * To change this template use File | Settings | File Templates.
 */
var AppDataLoader = (function() {

    // Attempt to get the user's brainhoney information
    function getAppData(success, error) {

        // Get all of the app data files
        var request = gapi.client.drive.files.list({
            q: "'appdata' in parents"
        });
        request.execute(function (results) {
            if (results.items) {

                // We got some results. See if what we are looking for is in them
                var brainhoneyData = results.items.filter(function (item) {
                    return item.mimeType === "application/vnd.agilix.brainhoney-config"
                })[0];
                if (brainhoneyData) {

                    // Get the contents of the file and pass them along
                    var accessToken = gapi.auth.getToken().access_token;
                    $.ajax(brainhoneyData.downloadUrl, {
                        headers: {
                            "Authorization": "Bearer " + accessToken
                        },
                        dataType: "json",
                        success: success
                    });
                } else {
                    // Couldn't get it. Prompt for it.
                    error();
                }
            } else {
                // No application data
                error();
            }
        });
    }

    return {
        getAppData: getAppData
    };
})();