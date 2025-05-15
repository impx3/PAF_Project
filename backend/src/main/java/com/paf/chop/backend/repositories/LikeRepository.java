package com.paf.chop.backend.repositories;

import com.paf.chop.backend.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndComment(User user, Comment comment);
    Boolean existsByCommentAndUser(Comment comment, User user);

    Optional<Like> findByUserAndPost(User user, Post post);
    Boolean existsByPostAndUser(Post post, User user);

    Optional<Like> findByUserAndVideo(User currentUser, Video video);
    Boolean existsByVideoAndUser(Video video, User currentUser);
}
