export const removerParticipante = async (c, id_grupo, participante) => {
    let resposta = await c.groupParticipantsUpdate(id_grupo, [participante], 'remove');
    return resposta;
};

export const adicionarParticipante = async (c, id_grupo, participantes) => {
    let resposta = await c.groupParticipantsUpdate(id_grupo, participantes, 'add');
    return resposta;
};

export const tornarAdminGrupo = async (c, id_grupo, participantes) => {
    let resposta = await c.groupParticipantsUpdate(id_grupo, participantes, 'promote');
    return resposta;
};

export const removerAdminGrupo = async (c, id_grupo, participantes) => {
    let resposta = await c.groupParticipantsUpdate(id_grupo, participantes, 'demote');
    return resposta;
};

export const obterInfoGrupo = async (c, id_grupo) => {
    let infoGrupo = await c.groupMetadata(id_grupo);
    return infoGrupo;
};

// Comandos personalizados
export const comandoInfo = async (c, id_chat) => {
    let info = `
    *Comandos Disponíveis:*
    - /help: Mostra todos os comandos disponíveis
    - /status: Exibe o status atual do bot
    - /grupos: Exibe a lista de grupos em que o bot está participando
    - /sair: Sair do grupo atual
    - /foto: Muda a foto do perfil do grupo
    `;
    return await c.sendMessage(id_chat, { text: info });
};

export const comandoStatus = async (c, id_chat) => {
    let status = 'O bot está online e funcionando normalmente!';
    return await c.sendMessage(id_chat, { text: status });
};

// Funções de utilidade
export const obterNumeroFormatado = (numero) => {
    return numero.replace(/[^\w\s]/gi, '');
};

export const verificarPermissao = (c, id_usuario, id_grupo) => {
    let membro = c.getGroupMember(id_grupo, id_usuario);
    if (membro) {
        return membro.admin ? 'Admin' : 'Membro';
    } else {
        return 'Desconhecido';
    }
};

// Definições dos tipos de mensagens
export const tiposMensagem = {
    texto: 'text',
    imagem: 'image',
    video: 'video',
    audio: 'audio',
    documento: 'document',
    figurinha: 'sticker',
    localizacao: 'location',
    contato: 'contact',
    notaDeVoz: 'voice'
};

// Funções de envio de mensagens customizadas
export const enviarMensagemComBotao = async (c, id_chat, texto, nomeBotao, acaoBotao) => {
    return await c.sendMessage(id_chat, {
        text: texto,
        buttons: [
            { buttonId: acaoBotao, buttonText: { displayText: nomeBotao }, type: 1 }
        ]
    });
};

// Finalização do Bot
export const encerrarBot = async (c) => {
    console.log("Bot encerrado com sucesso.");
    return await c.end(new Error("Comando de Encerramento"));
};
