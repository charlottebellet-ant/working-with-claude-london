package com.marlowefinch.todo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TodoServiceTest {

    private TodoService service;

    @BeforeEach
    void setUp() {
        service = new TodoService(new TodoRepository());
    }

    @Test
    void createSetsDefaultsAndTimestamp() {
        Todo todo = service.create("Calibrate the tamper station", null);
        assertThat(todo.getId()).isNotNull();
        assertThat(todo.isDone()).isFalse();
        assertThat(todo.getPriority()).isEqualTo(Priority.MEDIUM);
        assertThat(todo.getCreatedAt()).isNotNull();
    }

    @Test
    void createAcceptsBlankTitle() {
        // Documents current behaviour: there is no server-side validation yet (see TODO-232).
        Todo todo = service.create("   ", Priority.LOW);
        assertThat(todo.getTitle()).isEqualTo("   ");
    }

    @Test
    void listFiltersByDone() {
        service.create("open one", Priority.LOW);
        Todo done = service.create("done one", Priority.LOW);
        service.toggle(done.getId());

        assertThat(service.list(null)).hasSize(2);
        assertThat(service.list(true)).extracting(Todo::getTitle).containsExactly("done one");
        assertThat(service.list(false)).extracting(Todo::getTitle).containsExactly("open one");
    }

    @Test
    void getThrowsWhenMissing() {
        assertThatThrownBy(() -> service.get(404L))
                .isInstanceOf(TodoNotFoundException.class)
                .hasMessageContaining("404");
    }

    @Test
    void updateChangesOnlyProvidedFields() {
        Todo todo = service.create("original", Priority.LOW);
        Todo updated = service.update(todo.getId(), null, true, Priority.HIGH);
        assertThat(updated.getTitle()).isEqualTo("original");
        assertThat(updated.isDone()).isTrue();
        assertThat(updated.getPriority()).isEqualTo(Priority.HIGH);
    }

    @Test
    void toggleFlipsDoneEachTime() {
        Todo todo = service.create("flip", Priority.MEDIUM);
        assertThat(service.toggle(todo.getId()).isDone()).isTrue();
        assertThat(service.toggle(todo.getId()).isDone()).isFalse();
    }

    @Test
    void deleteRemovesTodoAndThrowsSecondTime() {
        Todo todo = service.create("delete me", Priority.MEDIUM);
        service.delete(todo.getId());
        assertThat(service.list(null)).isEmpty();
        assertThatThrownBy(() -> service.delete(todo.getId())).isInstanceOf(TodoNotFoundException.class);
    }
}
