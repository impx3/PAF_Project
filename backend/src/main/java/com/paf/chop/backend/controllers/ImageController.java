package com.paf.chop.backend.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.paf.chop.backend.services.FileStorageService;

import java.io.IOException;
import java.nio.file.Path;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.util.logging.Logger;

@RestController
public class ImageController {

    private static final String IMAGE_DIR = "./uploads/";

    private static final Logger LOGGER = Logger.getLogger(FileStorageService.class.getName());


    // @GetMapping("/images/{imageName}")
    // public byte[] getImage(@PathVariable String imageName) throws Exception {
    //     File imageFile = new File(IMAGE_DIR + imageName);
    //     return Files.readAllBytes(imageFile.toPath());
    // }



    @GetMapping("/images/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) throws IOException {
        Path imagePath = Paths.get(IMAGE_DIR).resolve(imageName).normalize();
        Resource resource = new UrlResource(imagePath.toUri());

        LOGGER.info("Final file name" + imagePath);
        LOGGER.info("Final file name" + resource);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        // Determine content type (PNG, JPEG, etc.)
        String contentType = Files.probeContentType(imagePath);
        if (contentType == null) {
            contentType = "application/octet-stream"; // Default if unknown
        }


        System.out.println("\n");
        System.out.println("\n");
        System.out.println(resource.getFilename());
        System.out.println("\n");
        System.out.println("\n");


        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}