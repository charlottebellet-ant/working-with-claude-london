package com.marlowefinch.todo;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TodoRepositoryTest {

    private TodoRepository repository;

    @BeforeEach
    void setUp() {
        repository = new TodoRepository();
    }

    private Todo unsaved(String title) {
        return new Todo(null, title, false, Priority.MEDIUM, Instant.now());
    }

    @Test
    void saveAssignsIncrementingIds() {
        Todo first = repository.save(unsaved("first"));
        Todo second = repository.save(unsaved("second"));
        assertThat(first.getId()).isEqualTo(1L);
        assertThat(second.getId()).isEqualTo(2L);
    }

    @Test
    void saveKeepsExistingId() {
        Todo todo = repository.save(unsaved("keep me"));
        todo.setTitle("renamed");
        repository.save(todo);
        assertThat(repository.count()).isEqualTo(1);
        assertThat(repository.findById(todo.getId())).get().extracting(Todo::getTitle).isEqualTo("renamed");
    }

    @Test
    void findAllReturnsTodosOrderedById() {
        repository.save(unsaved("a"));
        repository.save(unsaved("b"));
        repository.save(unsaved("c"));
        assertThat(repository.findAll()).extracting(Todo::getTitle).containsExactly("a", "b", "c");
    }

    @Test
    void findByIdReturnsEmptyForUnknownId() {
        assertThat(repository.findById(99L)).isEmpty();
    }

    @Test
    void deleteByIdReportsWhetherSomethingWasRemoved() {
        Todo todo = repository.save(unsaved("bin me"));
        assertThat(repository.deleteById(todo.getId())).isTrue();
        assertThat(repository.deleteById(todo.getId())).isFalse();
        assertThat(repository.count()).isZero();
    }
}
