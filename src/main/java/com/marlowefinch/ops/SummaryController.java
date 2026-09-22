package com.marlowefinch.ops;

import java.time.Clock;
import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SummaryController {

    private final DashboardRepository repository;
    private final Clock clock;

    public SummaryController(DashboardRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    @GetMapping("/api/summary")
    public Summary summary(@RequestParam(required = false) String from,
                           @RequestParam(required = false) String to) {
        DateRange range = DateRange.resolve(from, to, clock);
        Kpis kpis = repository.kpis(range);

        String worstCarrier = repository.onTimeByCarrier(range).stream()
                .filter(c -> c.delivered() > 0)
                .min(Comparator.comparingDouble(CarrierOnTime::rate))
                .map(CarrierOnTime::carrier)
                .orElse(null);

        List<TicketCategoryCount> ticketsByCategory = repository.ticketsByCategory(range);
        String busiestTicketCategory = ticketsByCategory.stream()
                .max(Comparator.comparingLong(TicketCategoryCount::total))
                .map(TicketCategoryCount::category)
                .orElse(null);

        return new Summary(kpis.from(), kpis.to(), kpis.onTimeRate(), kpis.openTickets(),
                kpis.revenue(), kpis.orders(), worstCarrier, busiestTicketCategory);
    }
}
