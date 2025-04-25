package com.paf.chop.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false, name="title" , length=50)
    private String title;

    @Column(nullable = false, name="content" , length=50)
    private String content;

    @Column(nullable = true, name="imageurl" , length=500)
    private String imageUrl;
}
