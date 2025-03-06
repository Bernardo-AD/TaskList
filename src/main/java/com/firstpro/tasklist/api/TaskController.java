package com.firstpro.tasklist.api;

import com.firstpro.tasklist.model.Task;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private List<Task> tasks = new ArrayList<>();

    @GetMapping
    public List<Task> listTasks(){
        return tasks;
    }

    @PostMapping
    public Task addTask(@RequestBody Task task){
        tasks.add(task);
        return task;
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable int id){
        if (id >= 0 && id < tasks.size()) {
            tasks.remove(id);
            return "Task removed successfully! ";
        } else {
            return "Task not found!";
        }
    }

    @PutMapping("{id}")
    public Task completeTask(@PathVariable int id){
        if (id >= 0 && id < tasks.size()) {
            Task task = tasks.get(id);
            task.setCompleted(true);
            return task;
        } else {
            return null;
        }
    }
}
