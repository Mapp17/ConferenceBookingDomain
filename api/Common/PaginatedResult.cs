using System.Diagnostics.Contracts;
using System.Security.Cryptography.X509Certificates;

namespace api.Common
{
    public class PaginatedResult<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }


        public PaginatedResult(List<T> items, int totalCount, int pageNumber = 1, int pageSize = 10)
        {
            Items = items;
            TotalCount = totalCount;
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
