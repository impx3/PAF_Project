package com.paf.chop.backend.repositories;

import com.paf.chop.backend.models.Comment;
import com.paf.chop.backend.models.Like;
import com.paf.chop.backend.models.Post;
import com.paf.chop.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndComment(User user, Comment comment);
    Boolean existsByCommentAndUser(Comment comment, User user);

    Optional<Like> findByUserAndPost(User user, Post post);
    Boolean existsByPostAndUser(Post post, User user);
}
