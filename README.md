# Setup

## Google Drive SDK

* Create an API project in the <a href="http://code.google.com/apis/console">Google APIs Console</a>.
* Select the *Services* tab and enable `Drive API` **and** `Drive SDK`.
* Select the *API Access* tab in your API project, and click `Create an OAuth 2.0 client ID`.
* In the Branding Information section, provide a name for your application (e.g. "Brainhoney Google Drive Connect"), and click Next. Providing a product logo is optional.
* In the Client ID Settings section, do the following:
    * Select Web application for the Application type
    * Click the more options link next to the heading, Your site or hostname.
    * List your hostname in the Authorized Redirect URIs and JavaScript Origins fields.
    * Click Create Client ID.
* In the API Access page, locate the section Client ID for Web applications and note the `Client ID for Drive SDK` value.

## Website
You don't need much setup. All you need to add your Drive SDK ID. To do that, edit `js/controllers/GoogleDriveController.js` and set the `CLIENT_ID` variable to be this value.

# Running
It's a static website. You don't need anything fancy. Just put it up on Apache.