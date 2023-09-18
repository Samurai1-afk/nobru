const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "ticket",
    description: "📱 Utilize para enviar uma embed para abrir um ticket",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: `**❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!**`,
                ephemeral: true,
            })
        } else {
            let embed = new Discord.EmbedBuilder()
                .setColor("2f3136")
                .setImage("https://cdn.discordapp.com/attachments/1114960787354697828/1114970025149874348/1683943831049-01.jpg")
                .addFields(
                    { name: 'Central de Atendimento da Kauex Store', value: `Olá, seja bem-vindo(a) a central de atendimento da [Kauex Store](https://discord.gg/kauexstore).` },

                    { name: 'Horario de atendimento:', value: `> **Segunda a Sexta**:
> 08:00 até as 23:00 Horas
> 
> **Sábado**:
> 09:30 até as 00:00 Horas

Realizamos atendimentos em outros horarios, basta ter algum membro da equipe online!` },
                )

            let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('ticket')
                        .setLabel('Abrir Ticket') 
                        .setStyle(2)
                )

 interaction.reply({embeds: [embed], components: [button]});
        }
    }
}