/**
 * Created with IntelliJ IDEA.
 * User: josh
 * Date: 6/21/13
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */
var GoogleDriveFileUploader = (function() {
    "use strict";

    function GoogleMetadata(args) {
        this.title = args.title || "Untitled";
        this.mimeType = args.mimeType || "application/vnd.agilix.brainhoney-config";
        this.parents = [{id: "appdata"}];
    }

    function uploadMultipart(body, boundary, callback) {
        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': body});
        if (!callback) {
            callback = function(file) {
                console.log(file)
            };
        }
        request.execute(callback);
    }

    function generateMultipartData(data, metadata) {
        var boundary = '-------314159265358979323846';
        var delimiter = "\r\n--" + boundary + "\r\n";
        var close_delim = "\r\n--" + boundary + "--";

        var base64Data = btoa(data);
        var body = delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + metadata.mimeType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        return {
            body: body,
            boundary: boundary
        };
    }

    return {
//        uploadMultipart: uploadMultipart,
//        uploadFile: function (file, metadata, callback) {
//            var reader = new FileReader();
//            reader.readAsBinaryString(file);
//            reader.onload = function() {
//                if (!metadata) {
//                    var contentType = file.type || 'application/octet-stream';
//                    metadata = {
//                        'title': file.name,
//                        'mimeType': contentType
//                    };
//                }
//                var data = generateMultipartData(reader.result, metadata);
//                uploadMultipart(data.body, data.boundary, callback);
//            };
//        },
        uploadString: function (string, title, callback) {
            callback = callback || function(data) { console.log(data); };
            var data = generateMultipartData(string, new GoogleMetadata({title: title}));
            uploadMultipart(data.body, data.boundary, callback);
        },
        GoogleMetadata: GoogleMetadata
    };
})();