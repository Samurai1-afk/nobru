const Discord = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: "addrole", // Coloque o nome do comando
    description: "📱 [Configuração] Adicionar um cargo temporário em algun usuário!", // Coloque a descrição do comando
    options: [
        {
            name: 'user',
            type: 6,
            description: 'Qual usuário você deseja adicionar o cargo?',
            required: true,
        },
        {
            name: 'role',
            type: 8,
            description: 'Qual o cargo que o usuário vai receber?',
            required: true,
        },
    ],
    type: Discord.ApplicationCommand.ChatInput,

    run: async (client, interaction) => {
        let user_id = interaction.options.getUser('user').id;
        let role = interaction.options.getRole('role');

        if (!interaction.member.roles.cache.get('seu-cargo')) return interaction.reply(`Você não tem permissão para utilizar este comando!`)

        let user = interaction.guild.members.cache.get(user_id)

        user.roles.add(role.id).then(() => {
            interaction.reply({ content: `Cargo adicionado com successo, O cargo do usuário vai expirar no dia: ${date}` })
        }).catch(() => {
            interaction.reply(`Eu não consegui adicionar o cargo ao usuário`)
        })
    }
}