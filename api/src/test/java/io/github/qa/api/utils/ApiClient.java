package io.github.qa.api.utils;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;

import java.util.Map;

import static io.restassured.RestAssured.given;

/**
 * Builds request specifications shared by every test: base URL, JSON headers,
 * request/response logging on failure and Allure attachments of each call.
 */
public final class ApiClient {

    private static final String BASE_URL =
            System.getProperty("api.baseUrl", "https://restful-booker.herokuapp.com");

    private ApiClient() {
    }

    public static RequestSpecification spec() {
        return new RequestSpecBuilder()
                .setBaseUri(BASE_URL)
                .setContentType(ContentType.JSON)
                // Restful-Booker answers 418 unless Accept is exactly "application/json";
                // setAccept(ContentType.JSON) would send several JSON media types.
                .addHeader("Accept", "application/json")
                .addFilter(new AllureRestAssured())
                .log(LogDetail.URI)
                .build();
    }

    /** Spec with the auth cookie the API requires for PUT, PATCH and DELETE. */
    public static RequestSpecification authorizedSpec() {
        return new RequestSpecBuilder()
                .addRequestSpecification(spec())
                .addCookie("token", createToken())
                .build();
    }

    public static String createToken() {
        return given(spec())
                .body(Map.of("username", "admin", "password", "password123"))
                .when()
                .post("/auth")
                .then()
                .statusCode(200)
                .extract()
                .path("token");
    }
}
