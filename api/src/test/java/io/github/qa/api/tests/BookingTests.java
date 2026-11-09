package io.github.qa.api.tests;

import io.github.qa.api.models.Booking;
import io.github.qa.api.utils.ApiClient;
import io.github.qa.api.utils.TestDataFactory;
import io.qameta.allure.Feature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Feature("Bookings")
class BookingTests {

    private Booking booking;
    private Integer bookingId;

    @BeforeEach
    void createBooking() {
        booking = TestDataFactory.newBooking();
        bookingId = given(ApiClient.spec())
                .body(booking)
                .when().post("/booking")
                .then().statusCode(200)
                .extract().path("bookingid");
    }

    /** Removes the test data so the shared demo API is left clean. */
    @AfterEach
    void deleteBooking() {
        if (bookingId != null) {
            given(ApiClient.authorizedSpec()).when().delete("/booking/" + bookingId);
        }
    }

    @Test
    @Tag("smoke")
    @DisplayName("TC-API-04 Create booking matches the response contract")
    void createBookingMatchesSchema() {
        given(ApiClient.spec())
                .body(TestDataFactory.newBooking())
                .when().post("/booking")
                .then()
                .statusCode(200)
                .body(matchesJsonSchemaInClasspath("schemas/create-booking-response.json"));
    }

    @Test
    @Tag("smoke")
    @DisplayName("TC-API-05 Get booking returns the data that was created")
    void getBookingReturnsCreatedData() {
        Booking actual = given(ApiClient.spec())
                .when().get("/booking/" + bookingId)
                .then().statusCode(200)
                .extract().as(Booking.class);

        assertEquals(booking, actual);
    }

    @Test
    @DisplayName("TC-API-06 Search by name returns the created booking")
    void searchByNameFindsBooking() {
        given(ApiClient.spec())
                .queryParam("firstname", booking.firstname())
                .queryParam("lastname", booking.lastname())
                .when().get("/booking")
                .then()
                .statusCode(200)
                .body("bookingid", hasItem(bookingId));
    }

    @Test
    @DisplayName("TC-API-07 Full update with a token replaces the booking")
    void fullUpdateWithToken() {
        Booking updated = new Booking(booking.firstname(), "Updated", 300, false,
                booking.bookingdates(), "Late checkout");

        given(ApiClient.authorizedSpec())
                .body(updated)
                .when().put("/booking/" + bookingId)
                .then()
                .statusCode(200)
                .body("lastname", equalTo("Updated"))
                .body("totalprice", equalTo(300))
                .body("depositpaid", equalTo(false));
    }

    @Test
    @DisplayName("TC-API-08 Partial update changes only the given fields")
    void partialUpdateWithToken() {
        given(ApiClient.authorizedSpec())
                .body(Map.of("additionalneeds", "Airport transfer"))
                .when().patch("/booking/" + bookingId)
                .then()
                .statusCode(200)
                .body("additionalneeds", equalTo("Airport transfer"))
                .body("firstname", equalTo(booking.firstname()));
    }

    @Test
    @DisplayName("TC-API-09 Update without a token is forbidden")
    void updateWithoutTokenIsForbidden() {
        given(ApiClient.spec())
                .body(booking)
                .when().put("/booking/" + bookingId)
                .then().statusCode(403);
    }

    @Test
    @DisplayName("TC-API-10 Deleted booking can no longer be retrieved")
    void deletedBookingIsGone() {
        given(ApiClient.authorizedSpec())
                .when().delete("/booking/" + bookingId)
                .then().statusCode(201);

        given(ApiClient.spec())
                .when().get("/booking/" + bookingId)
                .then().statusCode(404);

        bookingId = null;
    }

    @Test
    @DisplayName("TC-API-11 Unknown booking id returns 404")
    void unknownBookingReturns404() {
        given(ApiClient.spec())
                .when().get("/booking/999999999")
                .then().statusCode(404);
    }
}
