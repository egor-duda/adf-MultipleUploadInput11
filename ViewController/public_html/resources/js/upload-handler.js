function onLoad (event) {
    try {
        var legacy = true;
        try {
            var formData = new FormData();
            if (formData == null) { throw 'undefined'; }
            legacy = false;
        } catch (formdata_error) {
            legacy = true;
        }
        var subforms;
        if (legacy) {
            subforms = document.getElementsByClassName ('legacy-upload-form');
        } else {
            subforms = document.getElementsByClassName ('html5-upload-form');
        }
        for (var i = 0; i < subforms.length; i++) { subforms[i].style.display = "inline"; }
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
    var fileSelect = component.getPeer().getDomNode().parentNode.parentNode.querySelector('.upload-files');
    var uploadProgressPopup = AdfPage.PAGE.findComponentByAbsoluteId('upload-progress-popup');
    var uploadProgressDialog = AdfPage.PAGE.findComponentByAbsoluteId('upload-progress-dlg'); 
    var progressBar = document.querySelector('.upload-progress');
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
                fileSelect.value = "";
            } else {
                alert ('An error occurred: ' + xhr.status);
            }
        } catch (e) {
            alert (e);
        }
        uploadProgressPopup.hide();
    };
    xhr.upload.addEventListener ("progress", function(event) {
            try {
                if (!event.lengthComputable) return;
                uploadProgressDialog.setTitle('Uploading files: ' + Math.ceil(event.loaded*100/event.total) + '%');
                progressBar.max = event.total;
                progressBar.value = event.loaded;
            } catch (e) {
                alert (e);
            }
        }, 
        false);
    progressBar.value = 0;
    uploadProgressPopup.show();
    xhr.send(formData);
}
