package io.github.qa.api.utils;

import io.github.qa.api.models.Booking;

import java.time.LocalDate;
import java.util.UUID;

/** Creates unique booking data so parallel or repeated runs never collide on the shared demo API. */
public final class TestDataFactory {

    private TestDataFactory() {
    }

    public static Booking newBooking() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        LocalDate checkin = LocalDate.now().plusDays(10);
        return new Booking(
                "Qa" + suffix,
                "Tester",
                150,
                true,
                new Booking.BookingDates(checkin.toString(), checkin.plusDays(3).toString()),
                "Breakfast");
    }
}
