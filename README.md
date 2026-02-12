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


## License
The use of MIT LICENSE.

## AUTHOR
Masoka Andile Mohono at: masokaandiel17@gmail.com
