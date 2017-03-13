function onLoad (event) {
    var legacySubform = document.getElementById ('upload-form-legacy:upload-form-legacy-container');
    var newSubform = document.getElementById ('upload-form:upload-form-container');
    var test = AdfPage.PAGE.findComponentByAbsoluteId ('upload-form:upload-form-container');
    try {
        var formData = new FormData();
        newSubform.style.display = 'inline'
    } catch (e) {
        legacySubform.style.display = 'inline';
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
