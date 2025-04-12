package com.paf.chop.backend.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "resource_url")
    private List<String> resources;

    @ElementCollection
    @CollectionTable(name = "learning_plan_completed_resources", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "completed_resource_url")
    private List<String> completedResources;

    private int progress; // Calculated in percentage

    @Column(nullable = false)
    private String userId; // Who created this plan

    @Column(nullable = false)
    private boolean isPublic;

    // --- Constructors ---
    public LearningPlan() {}

    public LearningPlan(String title, String description, List<String> resources,
                        List<String> completedResources, String userId, boolean isPublic) {
        this.title = title;
        this.description = description;
        this.resources = resources;
        this.completedResources = completedResources;
        this.userId = userId;
        this.isPublic = isPublic;
        this.progress = calculateProgress(); // Auto-calculate progress
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public List<String> getResources() { return resources; }

    public void setResources(List<String> resources) { this.resources = resources; }

    public List<String> getCompletedResources() { return completedResources; }

    public void setCompletedResources(List<String> completedResources) {
        this.completedResources = completedResources;
        this.progress = calculateProgress(); // Re-calculate when updated
    }

    public int getProgress() { return progress; }

    //This allows service layer to manually update progress
    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getUserId() { return userId; }

    public void setUserId(String userId) { this.userId = userId; }

    public boolean isPublic() { return isPublic; }

    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    // --- Utility Method ---
    private int calculateProgress() {
        if (resources == null || resources.isEmpty()) return 0;
        if (completedResources == null || completedResources.isEmpty()) return 0;
        double percentage = ((double) completedResources.size() / resources.size()) * 100;
        return (int) percentage;
    }
}
