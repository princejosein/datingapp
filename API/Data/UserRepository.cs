using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(u => u.UserName == username.ToLower());
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<PagesList<MemberDTO>> GetMembersDtoAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUserName);

            query = query.Where(g => g.Gender == userParams.Gender);

            var MinDob = DateTime.Today.AddYears(-userParams.MaxAge).AddDays(-1);
            var MaxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= MinDob && u.DateOfBirth <= MaxDob);   

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending( u => u.Created),
                _ => query.OrderByDescending( u => u.LastActive)
            };      
                       
            return await PagesList<MemberDTO>.CreateAsync(query.ProjectTo<MemberDTO>
                (_mapper.ConfigurationProvider).AsNoTracking(), 
                userParams.PageNumber, userParams.PageSize);
        }

        public async Task<MemberDTO> GetMemberDtoAsync(string username)
        {
            return await _context.Users
                    .Where(u => u.UserName == username)
                    .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync();

        }
    }
}