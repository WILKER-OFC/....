document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const smsScreen = document.getElementById('sms-screen');
    const chatScreen = document.getElementById('chat-screen');
    const loginBtn = document.getElementById('login-btn');
    const verifyBtn = document.getElementById('verify-btn');
    const sendBtn = document.getElementById('send-btn');
    const msgInput = document.getElementById('msg-input');
    const messagesContainer = document.getElementById('messages');
    const otpInputs = document.querySelectorAll('.otp-input');

    loginBtn.addEventListener('click', () => {
        const phone = document.getElementById('phone-number').value.trim();
        if (!phone) return alert('Por favor, ingresa tu número');
        document.getElementById('display-number').textContent = phone;
        loginScreen.classList.add('hidden');
        smsScreen.classList.remove('hidden');
    });

    otpInputs.forEach((input, i) => {
        input.addEventListener('input', () => { if (input.value && i < 5) otpInputs[i+1].focus(); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !input.value && i > 0) otpInputs[i-1].focus(); });
    });

    verifyBtn.addEventListener('click', () => {
        smsScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
    });

    const sendMsg = () => {
        const text = msgInput.value.trim();
        if (!text) return;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const div = document.createElement('div');
        div.className = 'message sent';
        div.innerHTML = \`<div class="text">\${text}</div><div class="time">\${time}</div>\`;
        messagesContainer.appendChild(div);
        msgInput.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'message received';
            reply.innerHTML = \`<div class="text">¡Entendido! Soy Gohan de Whats Gohan plus. Recibí tu mensaje: "\${text}"</div><div class="time">\${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>\`;
            messagesContainer.appendChild(reply);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500);
    };

    sendBtn.addEventListener('click', sendMsg);
    msgInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMsg(); });
});