package com.paf.chop.backend.services;

import com.paf.chop.backend.dto.response.PostDTO;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import com.paf.chop.backend.repositories.PostRepository;
import com.paf.chop.backend.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

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
}
