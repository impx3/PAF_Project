package com.paf.chop.backend.controllers;

import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.services.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.paf.chop.backend.services.FileStorageService;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

@CrossOrigin(origins = "http://localhost:3000/", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/home")
    public String HomeEndpoint() {
        return "Homee at PC";
    }

    @PostMapping
    public ResponseEntity<EntityModel<Post>> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        System.out.println(title + "hereyrer");
        System.out.println(content + "hereyrer");
        System.out.println(image + "hereyrer");

        String imageUrl = image != null ? fileStorageService.storeFile(image) : null;

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        System.out.println("\n\n\n\n\n" + post);

        Post savedPost = postService.createPost(post);

        // HATEOAS links
        EntityModel<Post> resource = EntityModel.of(savedPost);
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).updatePost(savedPost.getId(), savedPost.getTitle(), savedPost.getContent(), image, imageUrl)).withRel("put"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());






        return ResponseEntity.ok(resource);
    }

    @PostMapping("/multi")
    public ResponseEntity<Post> createPostWithMultipleImages(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("images") List<MultipartFile> images) throws IOException {

        System.out.println(title + "hereyrer");
        System.out.println(content + "hereyrer");
        // System.out.println(images+"hereyrer");

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        System.out.println("\n\n\n\n\n" + post);

        List<String> savedImageFilenames = fileStorageService.saveFiles(images);

        System.out.println("nameszzz" + savedImageFilenames.get(0));
        post.setImageUrl(String.join(",", savedImageFilenames));

        return ResponseEntity.ok(postService.createPost(post));

    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id, @RequestParam("title") String title, @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("imageURLinCaseUserDidnotREUPLOAD") String imageurlincase___) throws IOException {
        System.out.println(imageurlincase___ + " incase thing");
        Pattern pattern = Pattern.compile(".png", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(imageurlincase___);
        boolean matchFound = matcher.find();
        if (matchFound) {
            System.out.println("Match found");
        } else {
            System.out.println("Match not found");
        }

        String imageUrl = image != null ? fileStorageService.storeFile(image) : imageurlincase___;
        System.out.println(imageUrl + "hey");
        Post post = new Post();
        post.setId(id);
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);

        return ResponseEntity.ok(postService.updatePost(id, post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
}
