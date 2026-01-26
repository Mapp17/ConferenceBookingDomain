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

## License
The use of MIT LICENSE.

## AUTHOR
Masoka Andile Mohono at: masokaandiel17@gmail.com
