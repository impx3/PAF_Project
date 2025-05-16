package com.paf.chop.backend.controllers;

import com.paf.chop.backend.dto.response.PostDTO;
import com.paf.chop.backend.services.impl.LikeService;
import com.paf.chop.backend.utils.ApiResponse;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;


import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.UserRepository;
import com.paf.chop.backend.services.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.support.ResourceTransactionManager;
import org.springframework.web.bind.annotation.*;

import com.paf.chop.backend.services.FileStorageService;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



@CrossOrigin(origins = "http://localhost:5173/", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {


    private final PostService postService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final LikeService likeService;

    @Autowired
    public PostController(PostService postService, FileStorageService fileStorageService, UserRepository userRepository, LikeService likeService) {
        this.postService = postService;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.likeService = likeService;
    }

    @GetMapping("/home")
    public String HomeEndpoint() {
        return "Homee at PC";
    }

    @PostMapping("/text")
    public ResponseEntity<EntityModel<Post>> createTextPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws IOException {

                System.out.println("eee");
                System.out.println(userDetails);
                
        User user = userRepository.findByUsername(userDetails.getUsername());

        System.out.println(title + "hereyrer");
        System.out.println(content + "hereyrer");
        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        
        post.setUser(user);

        System.out.println("----"+title);
        System.out.println("----"+content);
        

        Post savedPost = postService.createPost(post);

        EntityModel<Post> resource = EntityModel.of(savedPost);

        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).updateTextPost(savedPost.getId(), savedPost.getTitle(), savedPost.getContent())).withRel("put"));
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());

        return ResponseEntity
            .created(WebMvcLinkBuilder.linkTo(PostController.class).slash(savedPost.getId()).toUri())
            .body(resource);
    }



        @GetMapping("/text")
        public ResponseEntity<List<Post>> getAllTextPosts() {
            List<Post> allposts = postService.getAllPosts();
            List<Post> postsToSend = postService.getAllPosts();
            postsToSend.clear();
            for (Post post : allposts) {
                String t =  "--"+post.getImageUrl()+"--";
                if(t.length()==4){
                    System.out.println("No image found");
                    postsToSend.add(post);
                }
            }
            return ResponseEntity.ok(postsToSend);
        }

        @PutMapping("/text")
        public ResponseEntity<EntityModel<Post>> updateTextPost(
            @RequestParam("id") Long id,  @RequestParam("title") String title, @RequestParam("content") String content) throws IOException {
           System.out.println("title+++"+title);
    
            
            Post post = new Post();
            post.setId(id);
            post.setTitle(title);
            post.setContent(content);

            // return ResponseEntity.ok(postService.updatePost(id, post));

        Post savedPost = postService.updatePost(id, post);

        EntityModel<Post> resource = EntityModel.of(savedPost);
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).createTextPost(savedPost.getTitle(),savedPost.getContent())).withRel("post"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());

        return ResponseEntity
            .created(WebMvcLinkBuilder.linkTo(PostController.class).slash(savedPost.getId()).toUri())
            .body(resource);







            








        }


    @PostMapping
    public ResponseEntity<EntityModel<Post>> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws IOException {

        User user = userRepository.findByUsername(userDetails.getUsername());
        String imageUrl = image != null ? fileStorageService.storeFile(image) : null;

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setUser(user);
        System.out.println("\n\n\n\n\n" + post);

        Post savedPost = postService.createPost(post);

        // HATEOAS links
        EntityModel<Post> resource = EntityModel.of(savedPost);
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).updatePost(savedPost.getId(), savedPost.getTitle(),
        //                 savedPost.getContent(), image, imageUrl))
        //         .withRel("put"));
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());

        return ResponseEntity
            .created(WebMvcLinkBuilder.linkTo(PostController.class).slash(savedPost.getId()).toUri())
            .body(resource);
    }

    @PostMapping("/multi")
    public ResponseEntity<Post> createPostWithMultipleImages(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("images") List<MultipartFile> images,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws IOException {

        User user = userRepository.findByUsername(userDetails.getUsername());

        System.out.println(title + "hereyrer");
        System.out.println(content + "hereyrer");
        // System.out.println(images+"hereyrer");

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setUser(user);
        System.out.println("\n\n\n\n\n" + post);

        List<String> savedImageFilenames = fileStorageService.saveFiles(images);

        System.out.println("nameszzz" + savedImageFilenames.get(0));
        post.setImageUrl(String.join(",", savedImageFilenames));

        // return ResponseEntity.ok(postService.createPost(post));
        return ResponseEntity
        .created(WebMvcLinkBuilder.linkTo(PostController.class).slash(post.getId()).toUri())
        .body(postService.createPost(post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id, @RequestParam("title") String title, @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("imageURLinCaseUserDidnotREUPLOAD") String imageurlincase___,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws IOException {
        System.out.println(imageurlincase___ + " incase thing");
        Pattern pattern = Pattern.compile(".png", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(imageurlincase___);
        boolean matchFound = matcher.find();
        if (matchFound) {
            System.out.println("Match found");
        } else {
            System.out.println("Match not found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername());
        String imageUrl = image != null ? fileStorageService.storeFile(image) : imageurlincase___;
        System.out.println(imageUrl + "hey");
        Post post = new Post();
        post.setId(id);
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setUser(user);

        // return ResponseEntity.ok(postService.updatePost(id, post));
        
        return ResponseEntity
        .created(WebMvcLinkBuilder.linkTo(PostController.class).slash(post.getId()).toUri())
        .body(postService.updatePost(id, post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
         List<PostDTO> posts= postService.getAllPostResponses();
         return ResponseEntity.ok(posts);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Post>> getAllPostsByUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        List<Post> posts = postService.getAllPostsByUser(user);
        return ResponseEntity.ok(posts);
    }
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Post>> getPostById(@PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        Post savedPost = postService.getPostByIdUser(id,user);
        // HATEOAS links
        EntityModel<Post> resource = EntityModel.of(savedPost); //???
        resource.add(WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(PostController.class).deletePost(savedPost.getId())).withRel("delete"));
        // resource.add(WebMvcLinkBuilder.linkTo(
        //         WebMvcLinkBuilder.methodOn(PostController.class).getAllPosts()).withRel("all-posts"));
        // resource.add(WebMvcLinkBuilder.linkTo(
                // WebMvcLinkBuilder.methodOn(PostController.class).getPostById(savedPost.getId())).withSelfRel());

        return ResponseEntity.ok(resource);
    }

    //post likes
    @PostMapping("/like/{postId}")
    public ResponseEntity<ApiResponse<PostDTO>> likePost(@PathVariable Long postId) {
        ApiResponse<PostDTO> postResponseDTO = likeService.likePost(postId);

        if (postResponseDTO.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(postResponseDTO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(postResponseDTO);
        }
    }

}