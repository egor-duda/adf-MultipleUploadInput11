function onLoad (event) {
    try {
        var legacySubforms = document.getElementsByClassName ('legacy-upload-form');
        var newSubforms = document.getElementsByClassName ('html5-upload-form');
        var i;
        try {
            var formData = new FormData();
            for (i = 0; i < newSubforms.length; i++) { newSubforms[i].style.display = "inline"; }
        } catch (formdata_error) {
            for (i = 0; i < legacySubforms.length; i++) { legacySubforms[i].style.display = "inline"; }
        }
    } catch (e) {
        alert (e);
    }
}

function handleUpload (event) {
    try {
        var component = event.getSource();
        doUpload (component);
    } catch (e) {
        alert (e);
    }
}

function doUpload (component) {
    var contextPath = component.getProperty ('contextPath');
    var fileSelect = document.getElementById('upload');
    var progressBar = document.getElementById('progress-bar');
    var files = fileSelect.files;
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('photos[]', file, file.name);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', contextPath + '/servlet/upload', true);
    xhr.onload = function () {
        try {
            if (xhr.status === 200) {
                var response = JSON.parse (xhr.responseText);
                AdfCustomEvent.queue(component,
                            "UploadCompleteEvent",
                            response,
                            false);
                progressBar.style.visibility = "hidden";
            } else {
                alert ('An error occurred: ' + xhr.status);
            }
        } catch (e) {
            alert (e);
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
