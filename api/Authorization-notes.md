# Authorization Design Notes

## Why authorization should not live in controllers

Controllers are part of the API boundary and should remain thin. Their responsibility is to
handle HTTP concerns such as routing, model binding, and returning responses. Embedding
authorization logic inside controllers leads to duplication, tightly coupled code, and
logic that is difficult to test and maintain.

By delegating authorization to middleware and attributes such as `[Authorize]`, the system
ensures that access rules are enforced consistently before requests reach business logic.
This keeps controllers focused on orchestration rather than decision-making.

---

## Why roles belong in JWT tokens

JWT tokens represent the authenticated identity of the user and are sent with every request.
Including roles in the token allows the API to make authorization decisions without querying
the database on each request.

This approach improves performance, supports stateless APIs, and enables role-based access
control using built-in ASP.NET Core authorization mechanisms. It also allows external clients to understand the user's permissions immediately after login.

---

## How this design prepares the system for future growth

### Database relationships
Using Identity with Entity Framework Core establishes a strong foundation for mapping users,
roles, and related entities in the database. This allows future extensions such as linking
bookings directly to users.

### Booking ownership
With authenticated user IDs available in tokens, the system can later enforce ownership
rules without changing the authentication model.

### Frontend integration
JWT-based authentication is frontend-agnostic and works well with web and mobile clients.
Frontends can store tokens securely, attach them to requests, and enable or disable UI
features based on role information contained in the token.
