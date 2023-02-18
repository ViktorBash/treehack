console.log("This is a popup!")

// Step 1: Authenticate with gmail API (Can be hardcoded in exclusively for one user)
// Step 2: Get the last 24 hours of emails in a digestible form


window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    try {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log(token);
    });
  }
  catch (e) {
    console.log(e);
  }
  });
};
