package com.marlowefinch.todo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * A few todos so the app is not empty on first start. Not loaded under the "test" profile.
 */
@Configuration
@Profile("!test")
public class SeedData {

    @Bean
    CommandLineRunner seed(TodoService service) {
        return args -> {
            service.create("Order replacement grinder burrs for the Bristol store", Priority.HIGH);
            service.create("Draft the Q4 espresso machine price list", Priority.MEDIUM);
            service.create("Book the service van in for its MOT", Priority.LOW);
            service.create("Reply to the roastery about the demo unit", Priority.MEDIUM);
        };
    }
}
