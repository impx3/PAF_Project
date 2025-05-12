package com.paf.chop.backend.dto.response;

import com.paf.chop.backend.models.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Data
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private Integer likeCount;//post like
    private Boolean isLiked;//post like

    public PostDTO(Long id, String title, String content, String imageUrl, Integer likeCount, Boolean isLiked) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.likeCount = likeCount;
        this.isLiked = isLiked;

    }

    public PostDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.imageUrl = post.getImageUrl();
        this.likeCount = post.getLikeCount();
    }
}
