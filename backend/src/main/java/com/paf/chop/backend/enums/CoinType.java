package com.paf.chop.backend.enums;

import lombok.Getter;

@Getter
public enum CoinType {
    POST(10),
    COMMENT(5),
    FOLLOW(3),
    LIKE(1);

    private final int points;

    CoinType(int points) {
        this.points = points;
    }

}
