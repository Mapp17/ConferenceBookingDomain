using api.DTOs;
using api.Common;



namespace api.Services
{   
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId);

        Task<bool> CancelBookingAsync(int bookingId);

        Task<PaginatedResult<BookingListResponseDto>> GetUserBookingsAsync(int userId, int page, int pageSize);

        Task<PaginatedResult<BookingListResponseDto>> GetAllBookingsAsync(int page, int pageSize);

        Task<List<BookingListResponseDto>> GetFilteredBookingsAsync(
            string? roomName,
            DateTime? startDate,
            DateTime? endDate,
            string? status);

        Task<PaginatedResult<BookingListResponseDto>> GetSortedBookingsAsync(
            string? sortBy,
            bool descending,
            int page,
            int pageSize);
    }
    }
