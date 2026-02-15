# Conference Room Booking System - Domain Model
## Overview
A clean, intentional domain model implemented in C# that represents the core concepts of a Conference Room Booking System. This model enforces business rules, maintains valid object states, and serves as the foundation for future API development.

## Features
- Room Management: Create, update, and manage conference rooms with capacity and equipment tracking

- Booking System: Handle room reservations with time slot validation and conflict prevention

- Status Tracking: Comprehensive booking and room status management

- Business Rules: Enforced through domain logic, not just validation

- Immutable Value Objects: For time slots, room capacity, and money handling

## Domain Model Structure
### Core Entities
- ConferenceRoom (record): Represents a physical conference room with capacity, equipment, and availability tracking

- Booking (class): Manages room reservations with lifecycle management (pending → confirmed → cancelled/completed)

- TimeSlot (record): Immutable value object representing a time range with overlap detection

- RoomCapacity (record): Value object enforcing capacity constraints (1-100 attendees)

### Enums
- BookingStatus: Pending, Confirmed, Cancelled, Completed, NoShow

- RoomStatus: Available, UnderMaintenance, OutOfService, Reserved

- EquipmentType: Projector, VideoConferencing, Whiteboard, etc.

## Business Rules Enforced
### Room Management
- Room capacity must be between 1 and 100 attendees

- Cannot change room status if there are upcoming confirmed bookings


### Booking System
- Bookings cannot exceed 8 hours

- Cannot double-book rooms (time slot validation)

- Status transitions follow specific rules (e.g., can't cancel completed bookings)


- Time Management
End time must be after start time

- Date validations prevent booking too far in advance/past

### Getting Started
#### Prerequisites
- .NET 8 SDK or later

- Visual Studio 2022, VS Code, or any C# IDE

- Running the Demo
Clone the repository

- Open the solution in your IDE

- Run the console application to see the domain model in action.

## Profesional Reasoning

1. Why is removing a column more dangerous than adding one?

- Removing a column permanently deletes data.
If the data is still needed by:

- Older application versions

The loss is irreversible. Adding columns is backward-compatible.

2. Why are migrations preferred over manual SQL changes?

Migrations:

- Are version-controlled

- Are repeatable

- Work across environments

- Preserve schema history

Manual SQL creates undocumented, inconsistent changes.

3. What could go wrong if two developers modify schema without migrations?

- Conflicting schemas

- Environment drift

- Production bugs that cannot be reproduced

- Data loss

Migrations synchronize team changes.

4. Which schema changes are risky in production, and why?

- Making nullable columns non-nullable

- Changing data types

- Removing columns

- Renaming columns

These can break existing data or running systems.

### Pagination, Filtering, and Performance

**Pagination**  
Our API endpoints support pagination to efficiently handle large datasets. You can control pagination using the following query parameters:  
- `page` – the current page number (default: 1)  
- `pageSize` – the number of items per page (default: 10)  

The API returns metadata alongside results, including total items and total pages, allowing clients to navigate data easily.

**Supported Filters**  
You can filter results using query parameters specific to each endpoint. Common filters include:  
- `name` – filter by name or partial match  
- `type` – filter by category or type (e.g., `Standard`, `Boardroom`, `Training`)  
- `dateFrom` / `dateTo` – filter records within a date range  

Filters can be combined to refine queries.

**Performance Considerations**  
- Database queries are optimized using indexes on frequently filtered fields.  
- Pagination limits the number of records returned per request to prevent large data loads.  
- Filtering is applied at the database level to minimize in-memory operations and reduce API response times.


## Entity Relationships

The system has three core entities with the following relationships:

1. **Booking ↔ Room** (Many-to-One)
   - A Room can have many Bookings
   - A Booking belongs to exactly one Room
   - Enforced via foreign key `RoomId` with `DeleteBehavior.Restrict`

2. **Booking ↔ User** (Many-to-One)
   - A User can have many Bookings
   - A Booking belongs to exactly one User
   - Enforced via foreign key `UserId` with `DeleteBehavior.Restrict`

## Soft Delete Implementation

Soft delete is implemented on the **Room** entity for the following reasons:
- Historical data preservation for past bookings
- Legal/compliance requirements to maintain booking history
- Ability to restore rooms without losing associated data
- Prevents orphaned records in bookings

Implementation:
- `IsActive` boolean flag (default true)
- `DeletedAt` nullable DateTime for audit purposes
- Global query filter: `HasQueryFilter(r => r.IsActive)`
- All list endpoints automatically exclude inactive rooms

## Data Integrity Enforcement

Data integrity is enforced at multiple levels:

### Database Level
- Foreign key constraints with `DeleteBehavior.Restrict`
- Unique index on `(RoomId, Start, End)` to prevent double bookings at database level
- Required fields with proper data types

### Application/Service Level
- **Prevent double bookings**: Check for overlapping active bookings
- **Prevent booking inactive rooms**: Validate room `IsActive` flag
- **Valid date ranges**: Ensure `Start < End`
- **Business hours**: Bookings only allowed 8 AM - 8 PM
- **Capacity validation**: Room capacity must meet requirements

### Domain Level
- Business rules encapsulated in service layer
- Domain models with private constructors for controlled creation
- Encapsulated soft delete logic in `SoftDelete()` method

## API Design for Frontend Consumption

The API is designed with frontend needs in mind:

### Pagination
All list endpoints support pagination with consistent parameters:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 50)

### Filtering
- Multiple filter parameters (location, room type, capacity)
- Applied at database level (not in-memory)

### Sorting
- Configurable sort fields and direction
- Default sorting by start time

### Projections
- DTOs for all responses to avoid over-fetching
- List views use lightweight `BookingListResponse` instead of full entities

### Error Handling
- Consistent error response format with error codes
- Appropriate HTTP status codes
- Meaningful error messages

### Performance Optimizations
- Async/Await throughout
- `AsNoTracking()` for read-only queries
- Eager loading only when necessary
- Database-level filtering and sorting

## Security

- Role-based authorization (Admin, Employee, Receptionist)
- User-specific data access (users can only view their own bookings)
- Claims-based user identification



## License
The use of MIT LICENSE.

## AUTHOR
Masoka Andile Mohono at: masokaandiel17@gmail.com
