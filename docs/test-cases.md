# Test Cases

Every case below is automated. The id appears in the test title, so a result in the
Allure report can be traced back to this list.

## Mobile — My Demo App (Android)

| ID | Title | Steps | Expected result | Suite |
| --- | --- | --- | --- | --- |
| TC-LOGIN-01 | Login with valid credentials | Menu → Log In → enter valid user → Login | Product catalog is shown | Smoke |
| TC-LOGIN-02 | Empty username | Leave username empty, enter password → Login | "Username is required" | Regression |
| TC-LOGIN-03 | Empty password | Enter username, leave password empty → Login | "Password is required" | Regression |
| TC-LOGIN-04 | Locked-out user | Log in as the locked user | "Sorry, this user has been locked out." | Regression |
| TC-LOGIN-05 | Unknown credentials | Log in with an unregistered user | "Provided credentials do not match any user in this service." | Regression |
| TC-LOGIN-06 | Logout | Log in → Menu → Log Out → confirm | Logout confirmation, login screen shown | Smoke |
| TC-CAT-01 | Product list | Open the app | Products show a name and a price above 0 | Smoke |
| TC-CAT-02 | Sort by name A–Z | Sort → Name ascending | Names in ascending order | Regression |
| TC-CAT-03 | Sort by name Z–A | Sort → Name descending | Names in descending order | Regression |
| TC-CAT-04 | Sort by price low–high | Sort → Price ascending | Prices in ascending order | Regression |
| TC-CAT-05 | Sort by price high–low | Sort → Price descending | Prices in descending order | Regression |
| TC-CAT-06 | Product details | Open the first product | Name and price match the catalog | Smoke |
| TC-CART-01 | Add to cart | Product → Add To Cart | Cart badge shows 1 | Smoke |
| TC-CART-02 | Quantity and total | Set quantity 3 → Add To Cart → open cart | Badge 3, total items 3, total = unit price × 3 | Regression |
| TC-CART-03 | Remove from cart | Add product → cart → Remove | "No Items", badge cleared | Regression |
| TC-CHK-01 | End-to-end order | Add product → checkout → log in → address → payment → place order | Checkout complete, cart empty | Smoke |
| TC-CHK-02 | Mandatory shipping fields | Leave required address fields empty → To Payment | An error per required field, payment not opened | Regression |
| TC-CHK-03 | Optional shipping fields | Leave Address Line 2 and State empty → To Payment | Payment screen opens | Regression |
| TC-PAY-01 | Mandatory card fields | Leave every card field empty → Review Order | An error per card field, review not opened | Regression |
| TC-PAY-02 | Incomplete card number | Enter a 4-digit card number → Review Order | Card number error shown | Regression |

## API — Restful-Booker

| ID | Title | Request | Expected result | Suite |
| --- | --- | --- | --- | --- |
| TC-API-01 | Health check | `GET /ping` | 201 | Smoke |
| TC-API-02 | Valid credentials | `POST /auth` | 200 with a token | Smoke |
| TC-API-03 | Invalid credentials | `POST /auth` with a wrong password | `reason: Bad credentials`, no token | Regression |
| TC-API-04 | Create booking contract | `POST /booking` | 200, body matches the JSON schema | Smoke |
| TC-API-05 | Read booking | `GET /booking/{id}` | Body equals the created booking | Smoke |
| TC-API-06 | Search by name | `GET /booking?firstname&lastname` | Result contains the new id | Regression |
| TC-API-07 | Full update | `PUT /booking/{id}` with token | 200, fields updated | Regression |
| TC-API-08 | Partial update | `PATCH /booking/{id}` with token | Only the sent field changes | Regression |
| TC-API-09 | Update without token | `PUT /booking/{id}` without token | 403 | Regression |
| TC-API-10 | Delete booking | `DELETE` with token, then `GET` | 201, then 404 | Regression |
| TC-API-11 | Unknown id | `GET /booking/999999999` | 404 | Regression |

## Known API behaviour worth noting

- `POST /auth` with wrong credentials returns **200** with a `reason` field instead of **401**.
- `DELETE /booking/{id}` returns **201 Created** instead of **200/204**.

Both are asserted as the API behaves today and documented here, as they would be raised as defects
on a real product.
