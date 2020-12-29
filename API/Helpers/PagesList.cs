using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagesList<T> : List<T>
    {
        public PagesList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int) Math.Ceiling(count/ (double) pageSize);
            PageSize = pageSize;
            TotalCount = count;

            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }   
        public int TotalCount { get; set; }

        public static async Task<PagesList<T>> CreateAsync(IQueryable<T> source, int PageNumber, int PageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((PageNumber - 1) * PageSize)
                                    .Take(PageSize)
                                    .ToListAsync();
            return new PagesList<T>(items, count, PageNumber, PageSize);
        }
    }
}