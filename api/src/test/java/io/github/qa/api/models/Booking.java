package io.github.qa.api.models;

/** Request/response body of a booking in the Restful-Booker API. */
public record Booking(
        String firstname,
        String lastname,
        int totalprice,
        boolean depositpaid,
        BookingDates bookingdates,
        String additionalneeds) {

    public record BookingDates(String checkin, String checkout) {
    }
}
