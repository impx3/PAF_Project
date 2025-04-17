package com.paf.chop.backend.controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.paf.chop.backend.models.Video;
import com.paf.chop.backend.services.FileStorageService;
import com.paf.chop.backend.services.VideoService;

@RestController
@RequestMapping("/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @Autowired
    private FileStorageService fileStorageService;

    public Long getVideoDurationInSeconds(MultipartFile file) throws IOException {
    File tempFile = File.createTempFile("video", file.getOriginalFilename());
    file.transferTo(tempFile);

    ProcessBuilder pb = new ProcessBuilder("ffprobe", "-v", "error", "-show_entries",
            "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", tempFile.getAbsolutePath());

    Process process = pb.start();
    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
    String line = reader.readLine();

    tempFile.delete(); // clean up

    if (line != null) {
        double duration = Double.parseDouble(line);
        return (long) duration;
    } else {
        throw new IOException("Could not determine video duration");
    }
}


    @GetMapping("/home")
    public String homeatvidcontroller(){
        return "homeatvidcontroller";
    }

    @PostMapping
public ResponseEntity<EntityModel<Video>> uploadShortVideo(
    // public ResponseEntity<String> uploadShortVideo(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam("video") MultipartFile videoFile
        ) throws IOException {

            
    // if (videoFile.isEmpty()) {
    //     return ResponseEntity.badRequest().body(EntityModel.of("No video uploaded"));
    // }

    // check duration
    // Long duration = getVideoDurationInSeconds(videoFile);
    // if (duration > 30) {
    //     return ResponseEntity.badRequest().body(EntityModel.of("Video exceeds 30 seconds limit"));
    // }

    // store video
    String videoUrl = fileStorageService.saveVideo(videoFile);

    // save to DB
    Video video = new Video();
    video.setTitle(title);
    video.setDescription(description);
    video.setVideoUrl(videoUrl);
    System.out.println(title + "heye");
    System.out.println(description + "heye");
    System.out.println(videoUrl + "heye");
    // video.setUploadTime(LocalDateTime.now());
    // video.setDurationInSeconds(duration);

    Video savedVideo = videoService.saveVideo(video);
    
    EntityModel<Video> resource = EntityModel.of(savedVideo);
    
    resource.add(WebMvcLinkBuilder.linkTo(
        WebMvcLinkBuilder.methodOn(VideoController.class).getVideoById(savedVideo.getId())).withSelfRel());

        return ResponseEntity
        .created(WebMvcLinkBuilder.linkTo(VideoController.class).slash(savedVideo.getId()).toUri())
        .body(resource);



    // return ResponseEntity.ok("Postt");
}

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Video>> getVideoById(@PathVariable Long id) {
        return videoService.getVideoById(id)
                .map(video -> {
                    EntityModel<Video> resource = EntityModel.of(video);
                    resource.add(WebMvcLinkBuilder.linkTo(
                            WebMvcLinkBuilder.methodOn(VideoController.class).getVideoById(id)).withSelfRel());
                    return ResponseEntity.ok(resource);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}
