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

import com.paf.chop.backend.services.impl.LikeService;
import com.paf.chop.backend.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Slf4j
@Service
public class PostService {


    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final LikeService likeService;

    //post like
    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, LikeRepository likeRepository, LikeService likeService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.likeService = likeService;
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
       try{
           return postRepository.findAll();
       } catch (Exception e) {
           log.error(e.getMessage());
           throw new RuntimeException(e);
       }
    }

    public List<PostDTO> getAllPostResponses() {
        try{
            List<Post> posts =  postRepository.findAll();

            return posts.stream()
                    .map(post -> new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getImageUrl(), post.getLikeCount(), likeService.isPostLiked(post)))
                    .toList();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
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


}
