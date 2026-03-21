document.addEventListener('DOMContentLoaded', () => {
    // Socket.io initialization
    const socket = io();

    const loginScreen = document.getElementById('login-screen');
    const smsScreen = document.getElementById('sms-screen');
    const chatScreen = document.getElementById('chat-screen');
    const loginBtn = document.getElementById('login-btn');
    const verifyBtn = document.getElementById('verify-btn');
    const sendBtn = document.getElementById('send-btn');
    const msgInput = document.getElementById('msg-input');
    const messagesContainer = document.getElementById('messages');
    const otpInputs = document.querySelectorAll('.otp-input');
    const chatList = document.getElementById('chat-list');

    let currentUser = '';

    loginBtn.addEventListener('click', () => {
        const country = document.getElementById('country-code').value;
        const phone = document.getElementById('phone-number').value.trim();
        if (!phone) return alert('Por favor, ingresa tu número');

        currentUser = country + phone;
        document.getElementById('display-number').textContent = currentUser;
        loginScreen.classList.add('hidden');
        smsScreen.classList.remove('hidden');
    });

    otpInputs.forEach((input, i) => {
        input.addEventListener('input', () => {
            if (input.value && i < 5) otpInputs[i+1].focus();
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) otpInputs[i-1].focus();
        });
    });

    verifyBtn.addEventListener('click', () => {
        smsScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        // Register current user on socket
        socket.emit('join', currentUser);
    });

    const addMessageToUI = (msg) => {
        // Display message if it's sent by me OR it's from Gohan OR it's from someone else
        // (For this demo, we see all messages)
        const isSentByMe = msg.user === currentUser;

        const div = document.createElement('div');
        div.className = \`message \${isSentByMe ? 'sent' : 'received'}\`;

        div.innerHTML = \`
            <div class="text">\${msg.text}</div>
            <div class="time">\${msg.time}</div>
        \`;

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Actualizar el último mensaje en la lista de chats
        const lastMsgEl = chatList.querySelector('.chat-msg');
        if (lastMsgEl) lastMsgEl.textContent = msg.text;
        const timeEl = chatList.querySelector('.chat-time');
        if (timeEl) timeEl.textContent = msg.time;
    };

    const sendMsg = () => {
        const text = msgInput.value.trim();
        if (!text) return;

        const msgData = {
            user: currentUser,
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        socket.emit('chat message', msgData);
        msgInput.value = '';
    };

    socket.on('chat message', (msg) => {
        addMessageToUI(msg);
    });

    sendBtn.addEventListener('click', sendMsg);
    msgInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMsg();
    });

    // Handle responsive chat view (simple toggle)
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                chatScreen.classList.add('show-chat');
            }
        });
    });
});
