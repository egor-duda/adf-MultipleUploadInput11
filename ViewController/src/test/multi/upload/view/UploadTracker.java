package test.multi.upload.view;

import java.io.Serializable;

import java.util.Map;

import javax.faces.event.ValueChangeEvent;

import javax.servlet.http.HttpServletRequest;

import javax.servlet.http.HttpSession;

import oracle.adf.share.logging.ADFLogger;
import oracle.adf.view.rich.render.ClientEvent;

import org.apache.myfaces.trinidad.model.UploadedFile;

public class UploadTracker implements Serializable {
    
    private static final ADFLogger logger = ADFLogger.createADFLogger (UploadTracker.class);
    
    public UploadTracker() {
    }
    
    public static UploadTracker getInstance (HttpServletRequest request) {
        synchronized (request) {
            HttpSession session = request.getSession(false);
            UploadTracker retVal = (UploadTracker)session.getAttribute("UploadTracker");
            if (retVal == null) {
                retVal = new UploadTracker();
                session.setAttribute("UploadTracker", retVal);
            }
            return retVal;
        }
    }

    public String uploadComplete (ClientEvent event) {
        logger.info ("got UploadComplete event");
        for (String key: event.getParameters().keySet()) {
            Map<String, Object> value = (Map<String, Object>)event.getParameters().get(key);
            logger.info (key + " filename: " + value.get("filename"));
            logger.info (key + " size: " + value.get("filesize"));
        }
        return null;
    }

    public void registerUpload (String uploadName) {
        logger.info ("upload registered:" + uploadName);
        return;
    }

    public void uploadLegacyVCL(ValueChangeEvent valueChangeEvent) {
        UploadedFile file = (UploadedFile)valueChangeEvent.getNewValue();
        if (file != null) {
            logger.info ("legacy file upload: " + file.getFilename() + ": " + file.getLength());
        }
        return;
    }
}
