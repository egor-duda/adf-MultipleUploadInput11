function handleUpload (event) {
    try {
        var component = event.getSource();
        doUpload (component);
    } catch (e) {
        alert (e);
    }
}

function doUpload (component) {
    var fileSelect = document.getElementById('upload');
    var progressBar = document.getElementById('progress-bar');
    var files = fileSelect.files;
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('photos[]', file, file.name);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/MultipleUpload-ViewController-context-root/servlet/upload', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            AdfCustomEvent.queue(component,
                        "UploadCompleteEvent",
                        null,
                        false);
            progressBar.style.visibility = "hidden";
        } else {
            alert ('An error occurred: ' + xhr.status);
        }            
    };
    xhr.upload.addEventListener ("progress", function(e) {
            progressBar.max = e.total;
            progressBar.value = e.loaded;
        }, 
        false);
    progressBar.value = 0;
    progressBar.style.visibility = "visible";        
    xhr.send(formData);
}
