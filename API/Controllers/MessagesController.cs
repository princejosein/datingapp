using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, 
            IMapper mapper)
        {
            _mapper = mapper;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessage createMessage)
        {
            var username = User.GetUserName();
            if (username == createMessage.RecipientUsername) return BadRequest("You cannot send message to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recepient = await _userRepository.GetUserByUsernameAsync(createMessage.RecipientUsername);

            if (recepient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recepient,
                SenderUsername = sender.UserName,
                RecipientUsername = recepient.UserName,
                Content = createMessage.Content,
            };

            _messageRepository.AddMessage(message);

            if(await _messageRepository.SaveAllAsync())return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("Message Send Failed");

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery] 
            MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount,
                messages.TotalPages);

            return messages;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUserName();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]    
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUserName();

            var message = await _messageRepository.GetMessage(id);

            if(message.SenderUsername != username && message.RecipientUsername == username)
                return Unauthorized();

            if(message.Sender.UserName == username)message.SenderDeleted = true;

            if(message.Recipient.UserName == username)message.RecipientDeleted = true;

            if(message.SenderDeleted && message.RecipientDeleted)
                _messageRepository.DeleteMessage(message);
            
            if(await _messageRepository.SaveAllAsync())return Ok();

            return BadRequest("Message delete error");
            
        }

}
}