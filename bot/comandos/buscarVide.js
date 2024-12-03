const axios = require('axios');
const cheerio = require('cheerio');

async function buscarVideosXvideos(nomeVideo) {
    const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(nomeVideo)}`;
    const maxDuration = 9 * 60 * 1000;  // Máximo de 9 minutos (em milissegundos)

    try {
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);

        // Cria uma lista de vídeos
        let videos = [];
        $('a.thumbnail').each((index, element) => {
            const videoUrl = $(element).attr('href');
            const videoTitle = $(element).attr('title');
            
            if (videoUrl) {
                // Verifica se o vídeo tem a duração válida e pega o link do vídeo
                const videoDuration = $(element).closest('.thumb').find('.duration').text();
                const durationInMinutes = parseDuration(videoDuration);

                if (durationInMinutes <= 9) {
                    videos.push({ title: videoTitle, url: `https://www.xvideos.com${videoUrl}` });
                }

                if (videos.length >= 2) {
                    return false; // Para a busca após encontrar 2 vídeos
                }
            }
        });

        return videos;
    } catch (error) {
        console.error('Erro ao buscar vídeos no Xvideos:', error);
        return null;
    }
}

// Função para converter o formato de duração do vídeo em minutos
function parseDuration(duration) {
    const match = duration.match(/(\d+):(\d+)/);
    if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
}

module.exports = buscarVideosXvideos;
