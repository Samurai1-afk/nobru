const Discord = require("discord.js")
const config = require('../../config.json')

module.exports = {
    name: "owner", // Coloque o nome do comando
    description: "📱 [Utilidade] Informações do criador do bot!", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const owner = await client.users.cache.get(config.client.owner_id);

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setAuthor({ name: `${owner.username}`, iconURL: `${owner.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`Hello World!\n\n**🇧🇷 Português**\n> Olá, meu nome é \d atualmente tenho \`14 anos\` e atualmente sou **\`Desenvolvedor Full-Stack\`**. Desde os 12 anos eu tenho uma paixão por programação e desde ja venho estudando e tentando melhorar cada vez mais! Minha paixão por desenvolvimento vem por amor a jogos, desde pequeno eu sonho em criar meu proprio jogo e fazer dele oque eu sempre sonhei!!! Eu venho cada vez tentando inovar e melhorar minha vida e já estou conseguindo.\n\n**🇺🇸 English**\n> Hi, my name is \d I'm currently \`14 years old\` and I'm currently **\`Full-Stack Developer\`**. Since I was 12 years old I've had a passion for programming and since then I've been studying and trying to improve more and more! My passion for development comes from the love of games, since I was a little boy I've dreamed of creating my own game and making it what I've always dreamed of! !! I've been trying to innovate and improve my life and I'm already succeeding\n\n**<:discord:1072350806130561124> My Discord:** ${owner.tag}`)
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Website')
                            .setURL('https://.site'),
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Youtube')
                            .setURL('https://www.youtube.com/@d⁰¹'),
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('TikTok')
                            .setURL('https://www.tiktok.com/@davizinxyz'),
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Instagram')
                            .setURL('https://www.instagram.com/davizinxyz/')
                    )
            ]
        })
    }
}