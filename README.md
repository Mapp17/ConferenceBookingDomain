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

## Understanding Defensive Design
demonstrating defensive programming, robust domain modeling, and correct asynchronous behavior rather than just producing a working booking system. The solution intentionally shows how to anticipate failure, invalid input, and unsafe operations, and how to handle them cleanly within the domain.

1. Guard Clauses & Defensive Logic

- The system uses guard clauses at the start of methods and constructors to immediately reject invalid operations. This includes:

- Preventing invalid booking requests (e.g., invalid time ranges, overlapping bookings, invalid room states)

- Preventing operations on empty collections (e.g., attempting queries or saves when no bookings exist)

- Preventing invalid state transitions (e.g., cancelling a completed booking or confirming a cancelled one)

- These checks ensure the domain remains in a valid state at all times and that errors are detected early.

2. Exception Handling

- The system demonstrates intentional exception handling by:

- Throwing exceptions when business rules are violated and the operation cannot continue safely

- Allowing exceptions to bubble up when the caller is responsible for handling them

- Providing clear, meaningful exception messages that explain why an operation failed

- Defining and using at least one custom domain-specific exception to clearly communicate domain errors instead of relying only on generic exceptions

3. Edge Cases in Collections & LINQ

- Special care is taken when working with collections and LINQ:

- Empty collections are handled safely without causing runtime failures

- Missing or incomplete data is accounted for

- Failed queries return safe defaults instead of throwing unexpected exceptions

- Unsafe LINQ methods such as First() are avoided unless a prior check guarantees data exists. Safer alternatives like FirstOrDefault() and explicit checks are preferred.

4. Asynchronous File Operations

- The system persists booking data using asynchronous file operations:

- Booking data is saved to a file asynchronously using async/await

- Booking data is loaded asynchronously at startup

- Async methods are awaited correctly to ensure operations complete before program exit

- I/O failures (such as missing files or read/write errors) are handled safely without crashing the application

- This ensures non-blocking I/O and predictable program flow.

## License
The use of MIT LICENSE.

## AUTHOR
Masoka Andile Mohono at: masokaandiel17@gmail.com
