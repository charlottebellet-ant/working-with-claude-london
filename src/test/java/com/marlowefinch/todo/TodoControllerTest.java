package com.marlowefinch.todo;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TodoControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private TodoRepository repository;

    @BeforeEach
    void clearStore() {
        repository.deleteAll();
    }

    private long createTodo(String title, Priority priority) throws Exception {
        String body = mvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + title + "\",\"priority\":\"" + priority + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return Long.parseLong(body.replaceAll(".*\"id\":(\\d+).*", "$1"));
    }

    @Test
    void createReturns201WithLocationAndBody() throws Exception {
        String body = mvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Restock filter papers\",\"priority\":\"HIGH\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Restock filter papers"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.done").value(false))
                .andReturn().getResponse().getContentAsString();
        long id = Long.parseLong(body.replaceAll(".*\"id\":(\\d+).*", "$1"));
        mvc.perform(get("/api/todos/" + id)).andExpect(status().isOk());
    }

    @Test
    void createWithBlankTitleIsCurrentlyAccepted() throws Exception {
        // No server-side validation yet: a blank title is stored as-is. See TODO-232.
        mvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(""));
    }

    @Test
    void listReturnsAllAndSupportsDoneFilter() throws Exception {
        createTodo("open", Priority.LOW);
        long doneId = createTodo("done", Priority.LOW);
        mvc.perform(post("/api/todos/" + doneId + "/toggle")).andExpect(status().isOk());

        mvc.perform(get("/api/todos")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)));
        mvc.perform(get("/api/todos").param("done", "true"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("done"));
        mvc.perform(get("/api/todos").param("done", "false"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("open"));
    }

    @Test
    void getUnknownIdReturns404() throws Exception {
        mvc.perform(get("/api/todos/12345")).andExpect(status().isNotFound());
    }

    @Test
    void updateChangesTitleAndPriority() throws Exception {
        long id = createTodo("before", Priority.LOW);
        mvc.perform(put("/api/todos/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"after\",\"priority\":\"HIGH\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("after"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void toggleFlipsDone() throws Exception {
        long id = createTodo("toggle me", Priority.MEDIUM);
        mvc.perform(post("/api/todos/" + id + "/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.done").value(true));
        mvc.perform(post("/api/todos/" + id + "/toggle"))
                .andExpect(jsonPath("$.done").value(false));
    }

    @Test
    void deleteReturns204ThenGetReturns404() throws Exception {
        long id = createTodo("delete me", Priority.MEDIUM);
        mvc.perform(delete("/api/todos/" + id)).andExpect(status().isNoContent());
        mvc.perform(get("/api/todos/" + id)).andExpect(status().isNotFound());
        mvc.perform(delete("/api/todos/" + id)).andExpect(status().isNotFound());
    }
}
