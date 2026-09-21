package com.marlowefinch.todo;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import org.junit.jupiter.api.Test;

class TodoTest {

    @Test
    void newTodoDefaultsToMediumPriorityAndNotDone() {
        Todo todo = new Todo();
        assertThat(todo.getPriority()).isEqualTo(Priority.MEDIUM);
        assertThat(todo.isDone()).isFalse();
    }

    @Test
    void constructorSetsAllFields() {
        Instant now = Instant.now();
        Todo todo = new Todo(7L, "Descale the demo machine", true, Priority.HIGH, now);
        assertThat(todo.getId()).isEqualTo(7L);
        assertThat(todo.getTitle()).isEqualTo("Descale the demo machine");
        assertThat(todo.isDone()).isTrue();
        assertThat(todo.getPriority()).isEqualTo(Priority.HIGH);
        assertThat(todo.getCreatedAt()).isEqualTo(now);
    }

    @Test
    void toggleFlipsDone() {
        Todo todo = new Todo();
        todo.toggle();
        assertThat(todo.isDone()).isTrue();
        todo.toggle();
        assertThat(todo.isDone()).isFalse();
    }

    @Test
    void priorityHasExactlyThreeLevels() {
        assertThat(Priority.values()).containsExactly(Priority.LOW, Priority.MEDIUM, Priority.HIGH);
    }
}
