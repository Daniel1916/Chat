# Documentação do AndroidChat

## Visão Geral
O AndroidChat é uma aplicação web responsiva desenvolvida com HTML, CSS e JavaScript para permitir a comunicação entre dispositivos Android via rede móvel. A aplicação oferece uma interface amigável e intuitiva, com recursos de personalização e simulação de comunicação em tempo real.

## Funcionalidades Principais

1. **Interface Responsiva**
   - Design adaptável para diferentes tamanhos de tela
   - Otimizado para dispositivos móveis Android
   - Suporte a orientação retrato e paisagem

2. **Sistema de Chat**
   - Envio e recebimento de mensagens em tempo real
   - Indicação de status de conexão
   - Histórico de mensagens armazenado localmente

3. **Personalização**
   - Escolha de nome de usuário
   - Seleção de temas (Claro, Escuro, Azul, Verde)
   - Identificação única de sala de chat

4. **Compartilhamento**
   - Geração automática de ID de sala
   - Funcionalidade para copiar e compartilhar ID
   - Opção para entrar em salas existentes

## Tecnologias Utilizadas
- HTML5 para estrutura
- CSS3 para estilização e responsividade
- JavaScript para lógica e interatividade
- LocalStorage para persistência de dados
- Simulação de WebRTC para comunicação P2P

## Como Usar

### Instalação
1. Baixe todos os arquivos do projeto
2. Mantenha a estrutura de pastas intacta:
   - index.html (arquivo principal)
   - css/styles.css (estilos)
   - js/script.js (lógica)

### Execução
1. Abra o arquivo index.html em qualquer navegador moderno
2. A aplicação iniciará automaticamente
3. Para comunicação entre dispositivos:
   - Compartilhe o ID da sala (disponível nas configurações)
   - Os outros usuários devem inserir este ID na opção "Entrar em uma sala"

### Personalização
1. Clique no ícone de engrenagem no canto superior direito
2. Altere seu nome de usuário
3. Selecione o tema de sua preferência
4. Salve as configurações

## Limitações e Considerações
- Esta versão utiliza simulação de comunicação P2P
- Para implementação em produção, seria necessário um servidor de sinalização real
- O armazenamento é local (localStorage), portanto as mensagens são mantidas apenas no dispositivo

## Extensões Possíveis
- Implementação de WebRTC real para comunicação P2P
- Adição de suporte a envio de imagens e arquivos
- Implementação de criptografia ponta-a-ponta
- Integração com serviços de notificação push
