package io.github.qa.api.tests;

import io.github.qa.api.utils.ApiClient;
import io.qameta.allure.Feature;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;

@Feature("Authentication")
class AuthTests {

    @Test
    @Tag("smoke")
    @DisplayName("TC-API-01 Health check returns 201")
    void healthCheck() {
        given(ApiClient.spec())
                .when().get("/ping")
                .then().statusCode(201);
    }

    @Test
    @Tag("smoke")
    @DisplayName("TC-API-02 Valid credentials return a token")
    void validCredentialsReturnToken() {
        given(ApiClient.spec())
                .body(Map.of("username", "admin", "password", "password123"))
                .when().post("/auth")
                .then()
                .statusCode(200)
                .body("token", not(emptyOrNullString()));
    }

    @Test
    @DisplayName("TC-API-03 Invalid credentials are rejected without a token")
    void invalidCredentialsAreRejected() {
        given(ApiClient.spec())
                .body(Map.of("username", "admin", "password", "wrong-password"))
                .when().post("/auth")
                .then()
                // The API answers 200 with a reason instead of 401: documented here as a known API behaviour.
                .statusCode(200)
                .body("reason", equalTo("Bad credentials"))
                .body("token", nullValue());
    }
}
