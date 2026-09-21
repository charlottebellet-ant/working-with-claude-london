package com.marlowefinch.todo;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Business rules for todos. Note: there is no input validation here yet;
 * that is tracked as ticket TODO-232.
 */
@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> list(Boolean done) {
        List<Todo> all = repository.findAll();
        if (done == null) {
            return all;
        }
        return all.stream().filter(t -> t.isDone() == done).toList();
    }

    public Todo get(long id) {
        return repository.findById(id).orElseThrow(() -> new TodoNotFoundException(id));
    }

    public Todo create(String title, Priority priority) {
        Todo todo = new Todo();
        todo.setTitle(title);
        todo.setPriority(priority == null ? Priority.MEDIUM : priority);
        todo.setDone(false);
        todo.setCreatedAt(Instant.now());
        return repository.save(todo);
    }

    public Todo update(long id, String title, Boolean done, Priority priority) {
        Todo todo = get(id);
        if (title != null) {
            todo.setTitle(title);
        }
        if (done != null) {
            todo.setDone(done);
        }
        if (priority != null) {
            todo.setPriority(priority);
        }
        return repository.save(todo);
    }

    public Todo toggle(long id) {
        Todo todo = get(id);
        todo.toggle();
        return repository.save(todo);
    }

    public void delete(long id) {
        if (!repository.deleteById(id)) {
            throw new TodoNotFoundException(id);
        }
    }
}
