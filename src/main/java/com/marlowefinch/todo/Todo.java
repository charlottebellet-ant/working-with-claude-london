package com.marlowefinch.todo;

import java.time.Instant;

/**
 * A single task in the Marlowe &amp; Finch tracker.
 */
public class Todo {

    private Long id;
    private String title;
    private boolean done;
    private Priority priority = Priority.MEDIUM;
    private Instant createdAt;

    public Todo() {
    }

    public Todo(Long id, String title, boolean done, Priority priority, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public void toggle() {
        this.done = !this.done;
    }
}
