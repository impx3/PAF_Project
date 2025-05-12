package com.paf.chop.backend.services;

import com.paf.chop.backend.configs.Category;
import com.paf.chop.backend.dto.response.CommentResponseDTO;
import com.paf.chop.backend.dto.response.PostDTO;
import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.Like;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.LikeRepository;
import com.paf.chop.backend.repositories.PostRepository;
import com.paf.chop.backend.repositories.UserRepository;

import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
@Slf4j//like post
@Service
public class PostService {


    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    //post like
    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post post) {
        Post existingPost = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setImageUrl(post.getImageUrl());
        existingPost.setUser(post.getUser());
        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }


    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getAllPostsByUser(User user) {
        return postRepository.findByUser(user);
    }
    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post getPostByIdUser(Long id, User user) {
        List <Post> posts = postRepository.findByUser(user);
        for (Post post2 : posts) {
            if (Objects.equals(post2.getId(), id)) {
                return post2;
            }
        }
        return null;        
    }

    //like post
    public ApiResponse<PostDTO> likePost(Long postId) {
        try{
            log.info("Like post {}", postId);
            User currentUser = getCurrentUser();
            Post post = postRepository.findById(postId).orElse(null);

            if (post == null) {
                log.info("Post not found");
                return ApiResponse.error("Post not found");
            }
            // Check if user already liked the comment
            Optional<Like> existingLike = likeRepository.findByUserAndPost(currentUser, post);

            if (existingLike.isPresent()) {
                // User already liked the comment, so remove the like
                likeRepository.delete(existingLike.get());
                post.setLikeCount(post.getLikeCount() - 1);
                postRepository.save(post);
                log.info("Like post {}", postId);

                return ApiResponse.success(getPostResponseDTO(post), "Post unliked successfully");

            } else {

                // User has not liked the comment yet, so add a new like
                Like newLike = new Like();
                newLike.setUser(currentUser);
                newLike.setPost(post);
                newLike.setCategory(Category.POST);
                likeRepository.save(newLike);
                post.setLikeCount(post.getLikeCount() + 1);
                postRepository.save(post);
                log.info("Post liked {}", postId);

                return ApiResponse.success(getPostResponseDTO(post), "Post liked successfully");
            }

        } catch (Exception e) {
            return ApiResponse.error("Error liking post: " + e.getMessage());
        }
    }

    //like post
    public PostDTO getPostResponseDTO(Post post) {
        PostDTO postResponseDTO = new PostDTO();
        //response dto data
        postResponseDTO.setId(post.getId());
        postResponseDTO.setTitle(post.getTitle());
        postResponseDTO.setContent(post.getContent());
        postResponseDTO.setLikeCount(post.getLikeCount());
        postResponseDTO.setIsLiked(isLiked(post));

        return postResponseDTO;
    }
    //like post
    public User getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(currentUsername);
    }
    //like post
    public Boolean isLiked(Post post) {
        return likeRepository.existsByPostAndUser( post,  getCurrentUser());
    }
}
