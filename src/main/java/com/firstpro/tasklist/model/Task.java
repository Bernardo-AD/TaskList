package com.firstpro.tasklist.model;

public class Task {
    protected String description;
    private boolean completed;

    public Task(String description){
        this.description = description;
        this.completed = false;
    }

    public String getDescription(){
        return description;
    }

    public boolean isCompleted(){
        return completed;
    }
    public void setCompleted(boolean completed){
        this.completed = completed;
    }
}

