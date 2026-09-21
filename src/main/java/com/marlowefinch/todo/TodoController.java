package com.marlowefinch.todo;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Todo> list(@RequestParam(required = false) Boolean done) {
        return service.list(done);
    }

    @GetMapping("/{id}")
    public Todo get(@PathVariable long id) {
        return service.get(id);
    }

    @PostMapping
    public ResponseEntity<Todo> create(@RequestBody TodoRequest request) {
        Todo created = service.create(request.getTitle(), request.getPriority());
        return ResponseEntity.created(URI.create("/api/todos/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable long id, @RequestBody TodoRequest request) {
        return service.update(id, request.getTitle(), request.getDone(), request.getPriority());
    }

    @PostMapping("/{id}/toggle")
    public Todo toggle(@PathVariable long id) {
        return service.toggle(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
