function loadFile(url, data, callback, errorCallback) {
  // Set up an asynchronous request
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  
  // Hook the event that gets called as the request progresses
  request.onreadystatechange = function() {
    // If the request is "DONE" (completed or failed)
    if (request.readyState == 4) {
      // If we got HTTP status 200 (OK)
      if (request.status == 200) {
        callback(request.responseText, data);
      } else { // Failed
        errorCallback(url);
      }
    }
  };
  
  request.send(null);
}

function loadFiles(urls, callback, errorCallback) {
  var numUrls = urls.length;
  var numComplete = 0;
  var result = [];
  
  // Callback for a single file
  function partialCallback(text, urlIndex) {
    // index = urlIndex;
    // index = urls[urlIndex];
    
    // http://qiita.com/gorton@github/items/ded2d128ded9c9f732e8
    // index = urls[urlIndex].match(".+/(.+?)([\?#;].*)?$")[1];
    index = urls[urlIndex].match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
    result[index] = text;
    numComplete++;
    
    // When all files have downloaded
    if (numComplete == numUrls) {
      callback(result);
    }
  }
  
  for (var i=0; i<numUrls; ++i) {
    loadFile(urls[i], i, partialCallback, errorCallback);
  }
}
