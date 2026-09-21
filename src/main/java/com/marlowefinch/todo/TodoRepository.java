package com.marlowefinch.todo;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

/**
 * In-memory store. Everything is lost on restart, which is fine for the tracker.
 */
@Repository
public class TodoRepository {

    private final Map<Long, Todo> todos = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public List<Todo> findAll() {
        return todos.values().stream()
                .sorted(Comparator.comparing(Todo::getId))
                .toList();
    }

    public Optional<Todo> findById(long id) {
        return Optional.ofNullable(todos.get(id));
    }

    public Todo save(Todo todo) {
        if (todo.getId() == null) {
            todo.setId(nextId.getAndIncrement());
        }
        todos.put(todo.getId(), todo);
        return todo;
    }

    public boolean deleteById(long id) {
        return todos.remove(id) != null;
    }

    public void deleteAll() {
        todos.clear();
    }

    public int count() {
        return todos.size();
    }
}
