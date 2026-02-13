public class BookingSummaryDto
{
    public int Id { get; set; }
    public string RoomName { get; set; }
    public bool IsActive { get; set; }
    public string RoomType { get; set; }
    public string Location { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
}
