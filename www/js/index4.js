var authority = "https://login.windows.net/common",
redirectUri = "http://MyDirectorySearcherApp",
resourceUri = "https://graph.windows.net",
clientId = "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3";

var app = {
// Invoked when Cordova is fully loaded.
onDeviceReady: function() {
document.getElementById('search').addEventListener('click', app.search);
},
// initialize authentication operations.
search: function () {
app.authenticate(function (authresult) {

    app.requestData(authresult);
});
},
// Shows user authentication dialog if required.
authenticate: function (authCompletedCallback) {alert("01")

app.context = new Microsoft.ADAL.AuthenticationContext(authority);
app.context.tokenCache.readItems().then(function (items) {
    if (items.length > 0) {
        authority = items[0].authority;
        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        alert(app.context.webAbsoluteUrl);
    }
    // Attempt to authorize user silently
    app.context.acquireTokenSilentAsync(resourceUri, clientId)
    .then(authCompletedCallback, function () {
        // We require user cridentials so triggers authentication dialog
        app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
        .then(authCompletedCallback, function (err) {
            app.error("Failed to authenticate: " + err);
        });
    });
});

 },
// Makes Api call to receive user list.
requestData: function (authResult) {
alert("Token : "+authResult.accessToken);

$.ajax({
    /*beforeSend: function (request)
    {
        request.setRequestHeader('Authorization', 'Bearer ' + authResult.accessToken);
    },*/
    url: "https://delafini.sharepoint.com/mijnkantoor/_vti_bin/listdata.svc/UserInformationList",//?$filter=ContentType eq 'TeamMembers' and AccountId eq "+localStorage.curUserId,
    type: 'GET',
    //async: true,
    dataType: 'json',
    timeout: 2000,
    tryCount : 0,
    retryLimit : 5,
    error : function(xhr, textStatus, errorThrown ) {
            this.tryCount++;
            if (this.tryCount <= this.retryLimit) {
                //try again
                alert("getNAW DVWPMyAccount - " + this.tryCount);
                $.ajax(this);
                return;
            }            
            return;
    },
    success: function showData(data, status) {
    	personalColl = data.d.results;
		alert("done personalColl: "+JSON.stringify(personalColl))
		//$("#welcome").html('Enjoy.<br><br><a class="tutorial-close-btn" href="#">Start MY-PT</a>');
		//getResult("afterWelcomeX");
	    }
})

},

};

 document.addEventListener('deviceready', app.onDeviceReady, false);