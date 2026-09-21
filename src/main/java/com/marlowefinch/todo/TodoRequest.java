package com.marlowefinch.todo;

/**
 * Request body for creating or updating a todo. Fields left out of an update stay unchanged.
 */
public class TodoRequest {

    private String title;
    private Boolean done;
    private Priority priority;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }
}
