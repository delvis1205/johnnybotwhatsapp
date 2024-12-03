//REQUERINDO MODULOS
import {criarTexto, consoleComando} from './util.js';
import * as socket from '../baileys/socket.js';
import {tiposMensagem} from '../baileys/mensagem.js';
import moment from "moment-timezone";
import {buscarVideosXvideos} from '../livre/buscarVideosXvideos.js'; // Adicionando aqui
import PQueue from 'p-queue';

const queueMensagem = new PQueue({ concurrency: 6, timeout: 60000 });

export const chamadaComando = async (c, mensagemBaileys, botInfo) => {
    try {
        //Atribuição de valores
        const {
            comando,
            args,
            mensagem_grupo,
            mensagem,
            id_chat,
            nome_usuario
        } = mensagemBaileys;

        const t = moment.now();

        // Verifica se é o comando buscarvideo
        if (comando === 'buscarvideo') {
            queueMensagem.add(async () => {
                const termo = args.join(" ");
                if (!termo) {
                    return await socket.responderTexto(c, id_chat, "Digite o nome do vídeo após o comando.", mensagem);
                }

                const resultados = await buscarVideosXvideos(termo);

                if (resultados.length === 0) {
                    return await socket.responderTexto(c, id_chat, "Nenhum vídeo encontrado.", mensagem);
                }

                for (const video of resultados) {
                    const texto = `*Título*: ${video.titulo}\n*Duração*: ${Math.floor(video.duracao / 60)} minutos\n*Link*: ${video.url}`;
                    await socket.responderTexto(c, id_chat, texto, mensagem);
                }
                consoleComando(mensagem_grupo, "BUSCARVIDEO", comando, "#d9534f", t, nome_usuario);
            }, { priority: 1 });
        }

    } catch (err) {
        err.message = `chamadaComando - ${err.message}`;
        throw err;
    }
};
import {buscarVideosXvideos} from '../livre/buscarVideosXvideos.js'  // Importando a função de busca de vídeos

export const chamadaComando = async (c, mensagemBaileys, botInfo) => {
    try {
        // Atribuição de valores
        const comandos_info = comandosInfo(botInfo)
        const {
            comando,
            args,
            mensagem_grupo,
            tipo,
            mensagem,
            id_chat,
            nome_usuario,
            grupo
        } = mensagemBaileys
        const {nome : nome_grupo} = {...grupo}
        const t = moment.now()
        const msgGuia = (!args.length) ? false : args[0] === "guia"
        const queueMensagemEspera = queueMensagem.size > 10

        // Verificação do Auto-Sticker
        const autoStickerPv = (!mensagem_grupo && (tipo == tiposMensagem.imagem || tipo == tiposMensagem.video) && botInfo.autosticker)
        const autoStickerGrupo = (mensagem_grupo && (tipo == tiposMensagem.imagem || tipo == tiposMensagem.video) && grupo?.autosticker)

        // Verificação se há mensagens em espera na fila
        if(queueMensagemEspera) await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.fila_comando, queueMensagem.size), mensagem)
        
        // Chamadas de comandos
        if(verificarComandoExiste(botInfo, comando, 'utilidades')){
            // UTILIDADES
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c,id_chat, obterGuiaComando("utilidades", comando, botInfo), mensagem)
                await utilidadesComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "UTILIDADES", comando, "#de9a07", t, nome_usuario, nome_grupo)
            }, {priority: 1})
        } else if(verificarComandoExiste(botInfo, comando, 'buscarvideo')) {
            // COMANDO DE BUSCA DE VÍDEO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, "Você pode buscar vídeos no Xvideos com o comando `!buscarvideo [termo de pesquisa]`.", mensagem)
                const resultados = await buscarVideosXvideos(args.join(" "))  // Chama a função de busca
                if(resultados.length === 0) {
                    return await socket.responderTexto(c, id_chat, "Nenhum vídeo encontrado.", mensagem)
                }
                for (const video of resultados) {
                    if (video.duracao <= 9 * 60) {  // Verifica se a duração do vídeo é menor ou igual a 9 minutos
                        await socket.enviarVideo(c, id_chat, video.url)  // Envia o vídeo
                    }
                }
                consoleComando(mensagem_grupo, "BUSCA DE VÍDEO", comando, "#f39c12", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        }
        // (continuação do código existente para outros comandos)
    } catch (err) {
        err.message = `chamadaComando - ${err.message}`
        throw err
    }
                               }
