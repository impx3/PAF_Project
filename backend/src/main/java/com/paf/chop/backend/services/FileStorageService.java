package com.paf.chop.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;


import java.util.logging.Logger;


@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${video.upload-dir}")
    private String viduploadDir;

                private static final Logger LOGGER = Logger.getLogger(FileStorageService.class.getName());


    public String storeFile(MultipartFile file) throws IOException {
         // making sure  directory exists
         Path uploadPath = Paths.get(uploadDir);
         if (!Files.exists(uploadPath)) {
             Files.createDirectories(uploadPath);
         }
         // extract the original file extension
         String originalFilename = file.getOriginalFilename();

        // ensure originalFilename is not null and contains a dot to get file extension
        String fileExtension = "";
        if (originalFilename != null && originalFilename.lastIndexOf(".") != -1) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            LOGGER.warning("No file extension found!");
        }
        // fileExtension = ".png";
         // generate a unique file name and include the extension
         String fileName = UUID.randomUUID().toString() + fileExtension;
 

         // create file path
         Path filePath = uploadPath.resolve(fileName);
 
         // store the file
         Files.write(filePath, file.getBytes());
 
         // return the stored file path
         return filePath.toString();
    }

    
    //  to save multiple image files and returns their filenames
     
    public List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> filenames = new ArrayList<>();

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String extension = "";

                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                }

                String uniqueFilename = UUID.randomUUID() + extension;


                Path destination = uploadPath.resolve(uniqueFilename);
                
                // Files.write(destination, file.getBytes());
                 Files.write(destination, file.getBytes());

                filenames.add(uniqueFilename);
            }
        }

        return filenames;
    }

    public String saveVideo(MultipartFile file) throws IOException {
  // making sure  directory exists
  Path uploadPath = Paths.get(viduploadDir);
  if (!Files.exists(uploadPath)) {
      Files.createDirectories(uploadPath);
  }
  // extract the original file extension
  String originalFilename = file.getOriginalFilename();

 // making sure originalFilename is not null and contains a dot to get file extension
 String fileExtension = "";
 if (originalFilename != null && originalFilename.lastIndexOf(".") != -1) {
     fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
 } else {
     LOGGER.warning("No file extension found!");
 }
 // fileExtension = ".png";
  // generate a unique file name and include the extension
  String fileName = UUID.randomUUID().toString() + fileExtension;


  // create file path
  Path filePath = uploadPath.resolve(fileName);

  // store the file
  Files.write(filePath, file.getBytes());

  // return the stored file path
  return filePath.toString();

    }


}
