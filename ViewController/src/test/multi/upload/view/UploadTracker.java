package test.multi.upload.view;

import java.io.Serializable;

import javax.faces.event.ActionEvent;

import javax.servlet.http.HttpServletRequest;

import javax.servlet.http.HttpSession;

import oracle.adf.share.logging.ADFLogger;
import oracle.adf.view.rich.render.ClientEvent;

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
        logger.info ("got event");
        return null;
    }

    public void registerUpload (String uploadName) {
        logger.info ("upload registered:" + uploadName);
        return;
    }
}
