package test.multi.upload.view;

import com.fasterxml.jackson.core.JsonFactory;

import com.fasterxml.jackson.core.JsonGenerator;

import java.io.File;
import java.io.IOException;

import java.io.PrintWriter;

import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

public class MultiUploadServlet extends HttpServlet {

    public MultiUploadServlet() {
        super();
    }
    private boolean isMultipart;

    public void init( ){
        return;
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        UploadTracker uploadTracker = UploadTracker.getInstance(request);
        
        isMultipart = ServletFileUpload.isMultipartContent(request);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter( );
        DiskFileItemFactory factory = new DiskFileItemFactory();
        // maximum size that will be stored in memory
        // factory.setSizeThreshold(maxMemSize);
        // Location to save data that is larger than maxMemSize.
        factory.setRepository(new File("/tmp"));

        // Create a new file upload handler
        ServletFileUpload upload = new ServletFileUpload(factory);
        // maximum file size to be uploaded.
        // upload.setSizeMax( maxFileSize );
        
        int count = 0;
        JsonFactory outfactory = new JsonFactory();
        JsonGenerator generator = outfactory.createGenerator(out);
        try {
            Iterator<?> iterator = upload.parseRequest(request).iterator();
            while (iterator.hasNext()) {
                FileItem fileItem = (FileItem)iterator.next();
                if (!fileItem.isFormField ()) {
                    count ++;
                    uploadTracker.registerUpload (fileItem.getName());
                    generator.writeStartObject ();
                    generator.writeFieldName ("upload" + count);
                    generator.writeStringField ("filename", fileItem.getName());
                    generator.writeNumberField("filesize", fileItem.getSize());
                    generator.writeEndObject();
                }
            }
            return;
        } catch (FileUploadException ex) {
            throw new ServletException (ex);
        } finally {
            generator.close();
        }
    }
    
    public void doGet(HttpServletRequest request, 
                        HttpServletResponse response)
         throws ServletException, java.io.IOException {
         
         throw new ServletException("GET method used with " +
                 getClass( ).getName( )+": POST method required.");
    }     
}
