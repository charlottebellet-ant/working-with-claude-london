package com.marlowefinch.ops;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * The morning stand-up line: the four headline KPIs plus the two names that matter.
 * {@code worstCarrier} and {@code busiestTicketCategory} are null when the range is empty.
 */
public record Summary(
        LocalDate from,
        LocalDate to,
        Double onTimeRate,
        long openTickets,
        BigDecimal revenue,
        long orders,
        String worstCarrier,
        String busiestTicketCategory) {
}
