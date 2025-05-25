// Configurações e variáveis globais
let username = "Usuário" + Math.floor(Math.random() * 1000);
let currentTheme = "light";
let roomId = generateRoomId();
let peerConnections = {};
let dataChannels = {};
let localMessages = [];

// Elementos DOM
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeBtn = document.querySelector(".close-btn");
const saveSettingsBtn = document.getElementById("save-settings");
const usernameInput = document.getElementById("username-input");
const themeSelect = document.getElementById("theme-select");
const roomIdElement = document.getElementById("room-id");
const copyRoomIdBtn = document.getElementById("copy-room-id");
const joinRoomInput = document.getElementById("join-room-input");
const joinRoomBtn = document.getElementById("join-room-btn");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notification-text");
const connectedUsers = document.getElementById("connected-users");

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Carregar configurações salvas
    loadSettings();
    
    // Configurar sala
    roomIdElement.value = roomId;
    
    // Adicionar mensagem de boas-vindas
    addSystemMessage("Bem-vindo ao AndroidChat! Compartilhe o ID da sala para convidar outras pessoas.");
    
    // Inicializar simulação de conexão P2P
    initPeerConnectionSimulation();
    
    // Configurar eventos
    setupEventListeners();
}

function loadSettings() {
    // Carregar configurações do localStorage
    const savedUsername = localStorage.getItem("androidchat-username");
    const savedTheme = localStorage.getItem("androidchat-theme");
    
    if (savedUsername) {
        username = savedUsername;
        usernameInput.value = username;
    } else {
        usernameInput.value = username;
    }
    
    if (savedTheme) {
        currentTheme = savedTheme;
        themeSelect.value = currentTheme;
    }
    
    // Aplicar tema
    document.body.setAttribute("data-theme", currentTheme);
}

function setupEventListeners() {
    // Enviar mensagem
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
    
    // Modal de configurações
    settingsBtn.addEventListener("click", () => {
        settingsModal.classList.add("show");
    });
    
    closeBtn.addEventListener("click", () => {
        settingsModal.classList.remove("show");
    });
    
    saveSettingsBtn.addEventListener("click", saveSettings);
    
    // Copiar ID da sala
    copyRoomIdBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                showNotification("ID da sala copiado para a área de transferência!");
            })
            .catch(() => {
                // Fallback para navegadores que não suportam clipboard API
                roomIdElement.select();
                document.execCommand("copy");
                showNotification("ID da sala copiado para a área de transferência!");
            });
    });
    
    // Entrar em sala
    joinRoomBtn.addEventListener("click", () => {
        const newRoomId = joinRoomInput.value.trim();
        if (newRoomId && newRoomId !== roomId) {
            joinRoom(newRoomId);
        } else {
            showNotification("Por favor, insira um ID de sala válido.");
        }
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener("click", (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove("show");
        }
    });
}

function saveSettings() {
    const newUsername = usernameInput.value.trim();
    const newTheme = themeSelect.value;
    
    if (newUsername && newUsername !== username) {
        const oldUsername = username;
        username = newUsername;
        localStorage.setItem("androidchat-username", username);
        addSystemMessage(`"${oldUsername}" mudou o nome para "${username}"`);
    }
    
    if (newTheme !== currentTheme) {
        currentTheme = newTheme;
        document.body.setAttribute("data-theme", currentTheme);
        localStorage.setItem("androidchat-theme", currentTheme);
    }
    
    settingsModal.classList.remove("show");
    showNotification("Configurações salvas com sucesso!");
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        // Criar objeto de mensagem
        const message = {
            id: generateMessageId(),
            sender: username,
            text: messageText,
            timestamp: new Date().getTime(),
            type: "user"
        };
        
        // Adicionar à interface
        addMessageToChat(message, true);
        
        // Limpar input
        messageInput.value = "";
        
        // Salvar mensagem localmente
        localMessages.push(message);
        saveMessagesToLocalStorage();
        
        // Enviar para outros usuários (simulado)
        broadcastMessage(message);
    }
}

function addMessageToChat(message, isSent = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(isSent ? "message-sent" : "message-received");
    
    const time = new Date(message.timestamp);
    const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    if (message.type === "system") {
        messageElement.innerHTML = `
            <div class="message-text">${message.text}</div>
            <div class="message-info">
                <span class="message-time">${timeStr}</span>
            </div>
        `;
        messageElement.style.alignSelf = "center";
        messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        messageElement.style.color = "var(--text-color)";
        messageElement.style.opacity = "0.8";
        messageElement.style.maxWidth = "90%";
    } else {
        messageElement.innerHTML = `
            ${!isSent ? `<div class="message-sender">${message.sender}</div>` : ''}
            <div class="message-text">${message.text}</div>
            <div class="message-info">
                <span class="message-time">${timeStr}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    
    // Rolar para a última mensagem
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(text) {
    const message = {
        id: generateMessageId(),
        text: text,
        timestamp: new Date().getTime(),
        type: "system"
    };
    
    addMessageToChat(message);
    
    // Salvar mensagem localmente
    localMessages.push(message);
    saveMessagesToLocalStorage();
}

function showNotification(text) {
    notificationText.textContent = text;
    notification.classList.add("show");
    
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

// Simulação de conexão P2P
function initPeerConnectionSimulation() {
    // Simular conexões de outros usuários
    setTimeout(() => {
        simulateUserJoin("Android_User");
    }, 2000);
    
    // Carregar mensagens do localStorage
    loadMessagesFromLocalStorage();
    
    // Atualizar contador de usuários
    updateUserCount();
}

function simulateUserJoin(simulatedUsername) {
    // Adicionar à lista de conexões simuladas
    if (!peerConnections[simulatedUsername]) {
        peerConnections[simulatedUsername] = {
            connected: true,
            username: simulatedUsername
        };
        
        // Atualizar contador de usuários
        updateUserCount();
        
        // Mostrar mensagem de entrada
        addSystemMessage(`${simulatedUsername} entrou na sala`);
        
        // Simular mensagens ocasionais
        scheduleSimulatedMessages(simulatedUsername);
    }
}

function scheduleSimulatedMessages(simulatedUsername) {
    const messages = [
        "Olá! Como vai?",
        "Esse chat é bem legal!",
        "Estou testando a comunicação entre dispositivos Android.",
        "A interface está muito responsiva!",
        "Gostei dos temas disponíveis.",
        "Você pode compartilhar o ID da sala com outros usuários.",
        "O WebRTC permite comunicação P2P entre navegadores.",
        "Essa tecnologia funciona bem em redes móveis."
    ];
    
    // Enviar primeira mensagem após um tempo aleatório
    setTimeout(() => {
        receiveSimulatedMessage(simulatedUsername, messages[Math.floor(Math.random() * messages.length)]);
        
        // Agendar próximas mensagens
        const messageInterval = setInterval(() => {
            if (Math.random() > 0.3) { // 70% de chance de enviar mensagem
                receiveSimulatedMessage(simulatedUsername, messages[Math.floor(Math.random() * messages.length)]);
            }
        }, 15000 + Math.random() * 30000); // Entre 15 e 45 segundos
        
        // Simular desconexão após algum tempo
        setTimeout(() => {
            clearInterval(messageInterval);
            simulateUserLeave(simulatedUsername);
        }, 120000 + Math.random() * 180000); // Entre 2 e 5 minutos
    }, 5000 + Math.random() * 10000);
}

function receiveSimulatedMessage(simulatedUsername, text) {
    const message = {
        id: generateMessageId(),
        sender: simulatedUsername,
        text: text,
        timestamp: new Date().getTime(),
        type: "user"
    };
    
    // Adicionar à interface
    addMessageToChat(message, false);
    
    // Salvar mensagem localmente
    localMessages.push(message);
    saveMessagesToLocalStorage();
}

function simulateUserLeave(simulatedUsername) {
    if (peerConnections[simulatedUsername]) {
        delete peerConnections[simulatedUsername];
        
        // Atualizar contador de usuários
        updateUserCount();
        
        // Mostrar mensagem de saída
        addSystemMessage(`${simulatedUsername} saiu da sala`);
    }
}

function broadcastMessage(message) {
    // Em uma implementação real, isso enviaria a mensagem para todos os peers conectados
    // Aqui, apenas simulamos o envio
    console.log("Mensagem enviada para todos os usuários:", message);
}

function joinRoom(newRoomId) {
    // Em uma implementação real, isso se conectaria a uma nova sala P2P
    // Aqui, apenas simulamos a troca de sala
    roomId = newRoomId;
    roomIdElement.value = roomId;
    
    // Limpar conexões anteriores
    peerConnections = {};
    
    // Limpar mensagens
    chatMessages.innerHTML = "";
    localMessages = [];
    
    // Adicionar mensagem de boas-vindas
    addSystemMessage(`Você entrou na sala ${roomId}`);
    
    // Fechar modal
    settingsModal.classList.remove("show");
    
    // Simular novos usuários
    setTimeout(() => {
        simulateUserJoin("Android_User_" + Math.floor(Math.random() * 100));
    }, 2000);
    
    // Atualizar contador de usuários
    updateUserCount();
    
    showNotification("Conectado à nova sala!");
}

function updateUserCount() {
    const count = Object.keys(peerConnections).length + 1; // +1 para incluir o usuário atual
    connectedUsers.textContent = count;
}

// Persistência local
function saveMessagesToLocalStorage() {
    // Limitar a 100 mensagens para não sobrecarregar o localStorage
    const messagesToSave = localMessages.slice(-100);
    localStorage.setItem(`androidchat-messages-${roomId}`, JSON.stringify(messagesToSave));
}

function loadMessagesFromLocalStorage() {
    const savedMessages = localStorage.getItem(`androidchat-messages-${roomId}`);
    
    if (savedMessages) {
        try {
            const messages = JSON.parse(savedMessages);
            localMessages = messages;
            
            // Adicionar mensagens à interface
            messages.forEach(message => {
                const isSent = message.type === "user" && message.sender === username;
                addMessageToChat(message, isSent);
            });
        } catch (e) {
            console.error("Erro ao carregar mensagens:", e);
        }
    }
}

// Utilitários
function generateRoomId() {
    return Math.random().toString(36).substring(2, 10);
}

function generateMessageId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Simulação de WebRTC (em uma implementação real, isso usaria a API WebRTC)
// Esta é uma versão simplificada para demonstração
class WebRTCSimulation {
    constructor() {
        this.connections = {};
        this.onMessageCallbacks = [];
    }
    
    createOffer(peerId) {
        console.log("Criando oferta para", peerId);
        return Promise.resolve({
            type: "offer",
            sdp: "simulação-sdp-" + Math.random()
        });
    }
    
    createAnswer(offer, peerId) {
        console.log("Criando resposta para", peerId);
        return Promise.resolve({
            type: "answer",
            sdp: "simulação-sdp-resposta-" + Math.random()
        });
    }
    
    setLocalDescription(desc) {
        console.log("Definindo descrição local", desc.type);
        return Promise.resolve();
    }
    
    setRemoteDescription(desc) {
        console.log("Definindo descrição remota", desc.type);
        return Promise.resolve();
    }
    
    addIceCandidate(candidate) {
        console.log("Adicionando candidato ICE");
        return Promise.resolve();
    }
    
    createDataChannel(peerId, label) {
        console.log("Criando canal de dados", label, "para", peerId);
        return {
            send: (data) => {
                console.log("Enviando dados para", peerId, data);
                // Simular recebimento após um pequeno atraso
                setTimeout(() => {
                    this.simulateReceiveMessage(peerId, data);
                }, 100 + Math.random() * 200);
            },
            close: () => {
                console.log("Fechando canal de dados para", peerId);
            }
        };
    }
    
    onMessage(callback) {
        this.onMessageCallbacks.push(callback);
    }
    
    simulateReceiveMessage(peerId, data) {
        this.onMessageCallbacks.forEach(callback => {
            callback({
                data: data,
                origin: peerId
            });
        });
    }
}

// Inicializar simulação WebRTC
const webrtc = new WebRTCSimulation();
