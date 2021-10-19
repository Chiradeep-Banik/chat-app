const socket = io();
const form = document.querySelector('#form');
const send_btn = document.querySelector('#send');
const input = document.querySelector('#msg');
const list = document.querySelector('ul');
const params = new URLSearchParams(window.location.search);
const exit_btn = document.querySelector('#exit');
const container = document.querySelector('#container');

send_btn.addEventListener('click', () => {
    var msg = input.value;
    if(msg == '') return;
    socket.emit('send_msg',{ 
        sent_msg:msg,
        sender_id:socket.id,
        username:params.get('username'),
        room:params.get('room') 
    });
    input.value = '';
});
document.addEventListener('keypress', (e) => {
    if(e.keyCode == 13){
        send_btn.click();
    }
})

exit_btn.addEventListener('click', () => {
    socket.emit('exit_chat',{
        sender_id:socket.id,
        username:params.get('username'),
        room:params.get('room')
    });
    window.location.href = '/';
});

socket.on("connect", () => {
    console.log(`From client side on connection -> ${socket.id}`);
    socket.emit('join_chat',{
        sender_id:socket.id,
        username:params.get('username'),
        room:params.get('room')
    });
});

socket.on("send_msg", (data) => {
    console.log(`From client side on send_msg -> ${data.sender_id} ${data.sent_msg}`);
    var li = document.createElement('li');
    if(data.username == params.get('username')){
        li.classList.add('me');
    }else{
        li.classList.add('notme');
    }
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes()+ ":" + today.getSeconds();
    li.innerHTML = `
        <div class="line1">
            <div class="time">${time}</div>    
            <div class="user">${data.username}</div>
        </div>
        <div class="msg">${data.sent_msg}</div>
    `;
    list.appendChild(li);
    container.scrollTop = container.scrollHeight;
});
  
socket.on("disconnect", () => {
    console.log(`From client side on connection -> ${params.get('username')}`);
});

socket.on("exit_chat", (data) => {
    var li = document.createElement('li');
    li.innerHTML = `
            <span class="msg">${data.exited_user} has left the chat</span>
    `;
    li.classList.add('left');
    list.appendChild(li);
    container.scrollTop = container.scrollHeight;
});
socket.on("join_chat", (data) => {
    var li = document.createElement('li');
    li.innerHTML = `
            <span class="msg">${data.joined_user} has joined the chat</span>
    `;
    li.classList.add('join');
    list.appendChild(li);
    container.scrollTop = container.scrollHeight;
});