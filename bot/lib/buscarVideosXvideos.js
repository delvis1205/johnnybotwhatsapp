import axios from 'axios';
import cheerio from 'cheerio';

export const buscarVideosXvideos = async (termo) => {
    try {
        const url = `https://www.xvideos.com/?k=${encodeURIComponent(termo)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const videos = [];
        $('.thumb-block').each((i, el) => {
            const titulo = $(el).find('.thumb-under .title').text().trim();
            const duracao = $(el).find('.thumb-under .duration').text().trim();
            const link = `https://www.xvideos.com${$(el).find('a').attr('href')}`;

            // Converter duração em segundos
            const duracaoSegundos = duracao.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

            // Limitar duração a 9 minutos
            if (duracaoSegundos <= 9 * 60) {
                videos.push({ titulo, duracao: duracaoSegundos, url: link });
            }
        });

        return videos.slice(0, 2); // Retorna no máximo 2 vídeos
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error.message);
        return [];
    }
};
