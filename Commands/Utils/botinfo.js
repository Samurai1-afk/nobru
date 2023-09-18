const Discord = require("discord.js")

module.exports = {
    name: "botinfo", // Coloque o nome do comando
    description: "📱 [Utilidade] Utilize para ver informações sobre o bot", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let server_suporte = 'https://discord.gg/gamestore'
        let me_adicione = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`

        let servidor = client.guilds.cache.size;
        let usuarios = client.users.cache.size;
        let canais = client.channels.cache.size;
        let ping = client.ws.ping;
        let dono_id = client.users.cache.get(config.client.owner_id); // Seu ID
        let dono = client.users.cache.get(dono_id);
        let prefixo = ">";
        let versao = "14.3.0";
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let embed = new Discord.EmbedBuilder()
            .setColor(embed_color)
            .setAuthor({ name: `Olá eu me chamo ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Olá, eu me chamo ${client.user.username} (ou, como meus amigos próximos me chamam, "Leinad"), tenho 14 anos e sou apenas um simples bot brasileiro para o Discord com várias funções jamais vistas antes!
            
            Atualmente estou espalhando diversão em **${servidor} servidores** com **100 comandos** inovadores e já executei 1,000 comandos nas últimas 24 horas e acordei a **${days}d ${hours}h ${minutes}m ${seconds}s** atrás 😴. Desde 14 de Maio de 2022 tentando transformar o mundo em um lugar melhor!
            
            Eu fui criada em **__NodeJS__** utilizando **__JavaScript__** atualmente estou na versão ${versao}!

            🏅 Menções Honrosas
            • \`${dono_id.tag}\` Se não fosse por ele, eu nem iria existir!
            • Todas as pessoas que me ajudaram a ser desenvolvida!
            • E você, ${interaction.author}, por estar falando comigo... continue sendo uma pessoa incrível!😃
            `)
            .setTimestamp()
            .setFooter({ text: `Copyright © ${client.user.username}` });

        interaction.reply({
            embeds: [embed], components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Suporte')
                            .setURL(server_suporte),
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Me Adicione')
                            .setURL(me_adicione)
                    )
            ]
        });
    }
}