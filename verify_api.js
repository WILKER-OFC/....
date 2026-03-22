const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

async function test() {
    console.log('--- Iniciando Pruebas de Api Gohan ---');

    try {
        // 1. Registro
        console.log('\n1. Probando Registro...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Registro:', regRes.data);

        // Simular verificación manual en DB (ya que no podemos abrir el email)
        console.log('\n2. Simulando verificación de Gmail...');
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
        const user = data.users.find(u => u.email === 'test@example.com');
        user.verified = true;
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
        console.log('Usuario verificado en data.json');

        // 3. Login
        console.log('\n3. Probando Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        const apiKey = loginRes.data.apiKey;
        console.log('Login exitoso. API Key:', apiKey);

        // 4. Probar Endpoint de Uptime
        console.log('\n4. Probando Uptime...');
        const uptimeRes = await axios.get(`${BASE_URL}/api/uptime`);
        console.log('Uptime:', uptimeRes.data);

        // 5. Probar Endpoint de búsqueda con API Key
        console.log('\n5. Probando Búsqueda YT con API Key...');
        const searchRes = await axios.get(`${BASE_URL}/api/search?q=goku&apikey=${apiKey}`);
        console.log('Búsqueda (primer resultado):', searchRes.data.results[0].title);

        // 6. Probar Rotación de API Key
        console.log('\n6. Probando Rotación de API Key...');
        const rotateRes = await axios.post(`${BASE_URL}/api/rotate-key`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const newApiKey = rotateRes.data.apiKey;
        console.log('Nueva API Key:', newApiKey);

        // 7. Probar búsqueda con API Key antigua (debe fallar)
        console.log('\n7. Probando API Key antigua (debe fallar)...');
        try {
            await axios.get(`${BASE_URL}/api/search?q=goku&apikey=${apiKey}`);
        } catch (err) {
            console.log('Fallo esperado:', err.response.data.message);
        }

        // 8. Probar Leaderboard
        console.log('\n8. Probando Leaderboard...');
        const leaderboardRes = await axios.get(`${BASE_URL}/api/leaderboard`);
        console.log('Leaderboard:', leaderboardRes.data.leaderboard);

        console.log('\n--- ¡Todas las pruebas pasaron exitosamente! ---');
        process.exit(0);
    } catch (error) {
        console.error('\n--- Error en las pruebas ---');
        console.error(error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

// Iniciar servidor temporalmente para pruebas
const { spawn } = require('child_process');
const server = spawn('node', ['server.js']);

server.stdout.on('data', (data) => {
    console.log(`Servidor: ${data}`);
    if (data.toString().includes('Api Gohan funcionando')) {
        test();
    }
});

server.stderr.on('data', (data) => {
    console.error(`Servidor Error: ${data}`);
});
