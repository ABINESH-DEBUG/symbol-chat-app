const socket = io();
const group = 'devs';
const user = 'Abinesh';

socket.emit('joinGroup', group);

const input = document.getElementById('input');
const send = document.getElementById('send');
const messages = document.getElementById('messages');
const typing = document.getElementById('typing');

input.addEventListener('input', () => {
  socket.emit('typing', { group, user });
});

send.addEventListener('click', () => {
  const text = input.value;
  socket.emit('message', { group, user, text });
  input.value = '';
});

socket.on('message', data => {
  const msg = document.createElement('div');
  msg.textContent = `${data.user}: ${data.text}`;
  messages.appendChild(msg);
});

socket.on('typing', user => {
  typing.textContent = `${user} is typing...`;
  setTimeout(() => (typing.textContent = ''), 1000);
});