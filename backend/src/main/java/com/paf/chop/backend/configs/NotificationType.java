package com.paf.chop.backend.configs;

public enum NotificationType {
    LIKE("Like"),
    COMMENT("Comment"),
    FOLLOW("Follow"),;

    private final String type;

    NotificationType(String type) {
        this.type = type;
    }

}
