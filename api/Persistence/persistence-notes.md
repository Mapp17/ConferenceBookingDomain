# Persistence Notes

**In-memory storage** is useful for testing and prototyping because it is fast and requires no database setup. However, it is **not suitable for production** as data is lost when the application stops, and it cannot handle concurrent users or large datasets reliably.  

**DbContext** in Entity Framework Core (EF Core) represents a **unit of work and a session with the database**. It tracks changes to entities, manages querying, and coordinates saving updates. Each `DbContext` instance provides access to the sets of entities (tables) in the database.  

**EF Core** fits into the architecture as the **data access layer**, bridging the domain models (e.g., `Booking`, `ConferenceRoom`) and the underlying relational database. It allows you to perform CRUD operations, query data using LINQ, and maintain strong typing.  

Using EF Core prepares the system for more complex scenarios:  

- **Relationships:** Enables navigation properties and foreign keys between entities.  
- **Ownership:** Entities can own other entities or value objects, and EF Core manages cascading changes.  
- **Frontend usage:** Provides a reliable, queryable source of data that APIs can expose to the frontend, supporting features like room availability checks, booking listings, and user-specific views.  

This architecture ensures that the system is **scalable, maintainable, and production-ready**.
