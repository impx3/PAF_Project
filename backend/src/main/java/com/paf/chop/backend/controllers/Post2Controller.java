package com.paf.chop.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.services.PostService;

@CrossOrigin(origins = "http://localhost:5173/", maxAge = 3600)
@RestController
@RequestMapping("/api/posts2")
public class Post2Controller {
    

    private final PostService postService;

    @Autowired
    public Post2Controller(PostService postService) {
        this.postService = postService;
    }
    @GetMapping("/home")
    public String homeEndpointPosts2() {
        return "Home at /api/posts2/home";
    }


    // public String forAudience() {
    @GetMapping("/foraudience")
    public ResponseEntity<List<Post>> forAudience() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
        // return "This is open for everyone (no authentication)";
    }


    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Post>> getPostById(@PathVariable Long id) {

        Post savedPost = postService.getPostById(id);

        EntityModel<Post> resource = EntityModel.of(savedPost);
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());

        return ResponseEntity.ok(resource);
    }


}
