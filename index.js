const Discord = require("discord.js");

const {
    GatewayIntentBits
} = require('discord.js');

const {
    ActivityType
} = require("discord.js");

const sourcebin = require('sourcebin');

const config = require("./config.json");

// DB
const {
    QuickDB
} = require('quick.db');
global.db = new QuickDB();
//

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        '32767'
    ]
});

global.embed_color = "00000b";

module.exports = client

client.on('interactionCreate', (interaction) => {

    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply({
            content: `Erro, este comando não existe`, ephemeral: true
        });

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction)

    }
});

client.on("ready", () => {
    console.log(`🤖 Estou como ${client.user.username}`)
});

/*============================= | STATUS RICH PRESENCE | =========================================*/

client.on("ready", () => {
    let react = [
        `🤖 Duvidas?`,
        `🤖 Ajuda`,
        `🎫 Ticket`,
        `🌐 Versão: v${require('discord.js').version.slice(0, 6)}`,
        `🌐 Criado por kauex#0002`
    ],

        loop = 0;
    setInterval(() => client.user.setPresence({
        activities: [{
            name: `${react[loop++ % react.length]}`,
            type: ActivityType.Playing,
            url: 'https://www.youtube.com/watch?v='
        }]
    }), 1000 * 10);

    client.user
        .setStatus("online");
});


/*============================= | Import handler | =========================================*/

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.client.token)

/*============================= | SYSTEM TICKET | =========================================*/

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton() && interaction.customId === "ticket") {

        var row = await db.all();
        row = row.filter((p) => p.value === `${interaction.user.id}`);

        if (row[1]) {
            interaction.reply({
                content: `Você já possui um ticket aberto.`, ephemeral: true
            })
        } else {
            const ticketID = Math.floor(Math.random() * 5000) + 1000;
            interaction.guild.channels.create({
                name: `🎫-${ticketID}`,
                type: 0,
                parent: config.ticket.category_id,
                permissionOverwrites: [{
                    id: interaction.guild.id,
                    deny: ["ViewChannel"]
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                },
                {
                    id: config.ticket.support_role,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                },
                ],
            }).then(c => {
                db.set(`${ticketID}`, `${interaction.user.id}`)
                interaction.reply({
                    content: `Olá, seu ticket foi aberto em ${c}.`, ephemeral: true
                })
                c.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor("2f3136")
                            .setImage("https://media.discordapp.net/attachments/1050315884364840980/1072249567292162078/standard_1.gif")
                            .setDescription(`<:1102901559429431417:1108187874937028628> Ticket aberto por: \`${interaction.user.tag}\`

Para adiantar seu atendimento, informe previamente oque você deseja.`)
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("delete")
                                    .setLabel("Fechar")
                                    .setStyle("Danger"),
                                new Discord.ButtonBuilder()
                                    .setCustomId("create_call")
                                    .setLabel("Criar call")
                                    .setStyle("Success"),
                                new Discord.ButtonBuilder()
                                    .setCustomId("add_user")
                                    .setLabel("Adicionar usuário")
                                    .setStyle("Secondary"),
                                new Discord.ButtonBuilder()
                                    .setCustomId("remove_user")
                                    .setLabel("Remover usuário")
                                    .setStyle("Secondary"),
                                new Discord.ButtonBuilder()
                                    .setCustomId("transcript")
                                    .setLabel("Backup")
                                    .setStyle("Primary"),
                            ),
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("notify_user")
                                    .setLabel("Notificação")
                                    .setStyle("Secondary"),
                            )
                    ]
                })
            })
        }
    } else if (interaction.customId === 'assumir_ticket') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            let embed_perm = new Discord.EmbedBuilder()
                .setColor('2f3136')
                .setTitle("X | Ocorreu um erro!")
                .setDescription("X | Você não tem permissão para clicar neste botão.")
            return interaction.reply({ embeds: [embed_perm], ephemeral: true });
        } else {
            const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
            const idPessoa = row;
            const user = await interaction.guild.members.fetch(idPessoa)
            await user.send({
                embeds: [new Discord.EmbedBuilder()
                    .setColor("#2f3136")
                    .setDescription(`Um staff assumiu o seu ticket!\n\n Canal: ${interaction.channel}`)] }).catch(e => { })
            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor("#2f3136")
                        .setImage("https://media.discordapp.net/attachments/1050315884364840980/1072249567292162078/standard_1.gif")
                        .setDescription(`<:f8884d9b28c446e5bb36a99edfebd526:1097392251140845690> Ticket aberto por: ${interaction.user.tag}

Para adiantar seu atendimento, informe previamente oque você deseja.

<:10c8f0a725cd42749efaea59502360cc:1097392958837370911> Ticket assumido por: ${interaction.user}`)
                ],
                content: `${user}`, components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("delete")
                                .setLabel("Fechar")
                                .setStyle("Danger"),
                            new Discord.ButtonBuilder()
                                .setCustomId("create_call")
                                .setLabel("Criar call")
                                .setStyle("Success"),
                            new Discord.ButtonBuilder()
                                .setCustomId("add_user")
                                .setLabel("Adicionar usuário")
                                .setStyle("Secondary"),
                            new Discord.ButtonBuilder()
                                .setCustomId("remove_user")
                                .setLabel("Remover usuário")
                                .setStyle("Secondary"),
                            new Discord.ButtonBuilder()
                                .setCustomId("transcript")
                                .setLabel("Backup")
                                .setStyle("Primary"),
                        ),
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("assumir_ticket")
                                .setLabel("Assumir Ticket")
                                .setStyle("Secondary")
                                .setDisabled(true),
                        )
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("notify_user")
                                .setLabel("Notificação")
                                .setStyle("Secondary"),
                        )
                ] })
        }

    } else if (interaction.customId === 'create_call') {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        interaction.guild.channels.create({
            name: `call-${interaction.channel.name.replace('-', '')}`,
            type: 2,
            parent: config.ticket.category_call_id,
            permissionOverwrites: [{
                id: interaction.guild.id,
                deny: ["ViewChannel"],
            },
            {
                id: idPessoa,
                allow: ["Connect", "ViewChannel"],
            },
            {
                id: config.ticket.support_role,
                allow: ["Connect", "ViewChannel"],
            },
            ]
        }).then(c => {
            return interaction.update({
                components: [new Discord.ActionRowBuilder()
                    .addComponents(new Discord.ButtonBuilder()
                        .setCustomId("delete")
                        .setLabel("Fechar")
                        .setStyle("Danger"), new Discord.ButtonBuilder()
                            .setCustomId(`delete_${c.id}`)
                            .setLabel("Fechar call")
                            .setStyle("Danger"), new Discord.ButtonBuilder()
                                .setCustomId("add_user")
                                .setLabel("Adicionar usuário")
                                .setStyle("Secondary"), new Discord.ButtonBuilder()
                                    .setCustomId("remove_user")
                                    .setLabel("Remover usuário")
                                    .setStyle("Secondary"), new Discord.ButtonBuilder()
                                        .setCustomId("transcript")
                                        .setLabel("Backup")
                                        .setStyle("Primary"),), new Discord.ActionRowBuilder()
                                            .addComponents(new Discord.ButtonBuilder()
                                                .setCustomId("notify_user")
                                                .setLabel("Notificação")
                                                .setStyle("Secondary"),)
                ]
            })
        })
    } else if (interaction.customId.startsWith(`delete_`)) {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        var channel = interaction.customId.slice(interaction.customId.indexOf('🎫-')).replace('-', '');

        var channels_ticket_call = await interaction.guild.channels.cache.filter(c => c.name.includes('call-🎫'));

        channels_ticket_call.forEach(async element => {
            element = await element
            element.delete()
        });


        return interaction.update({
            components: [new Discord.ActionRowBuilder()
                .addComponents(new Discord.ButtonBuilder()
                    .setCustomId("delete")
                    .setLabel("Fechar")
                    .setStyle("Danger"), new Discord.ButtonBuilder()
                        .setCustomId("create_call")
                        .setLabel("Criar call")
                        .setStyle("Success")
                        .setDisabled(true), new Discord.ButtonBuilder()
                            .setCustomId("add_user")
                            .setLabel("Adicionar usuário")
                            .setStyle("Secondary"), new Discord.ButtonBuilder()
                                .setCustomId("remove_user")
                                .setLabel("Remover usuário")
                                .setStyle("Secondary"), new Discord.ButtonBuilder()
                                    .setCustomId("transcript")
                                    .setLabel("Backup")
                                    .setStyle("Primary"),), new Discord.ActionRowBuilder()
                                        .addComponents(new Discord.ButtonBuilder()
                                            .setCustomId("notify_user")
                                            .setLabel("Notificação")
                                            .setStyle("Secondary"),
                                        ),
            ]
        })
    } else if (interaction.customId === 'add_user') {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        const message = await interaction.reply(`Insira o id do usuário que você deseja adicionar!`)

        const collector = interaction.channel.createMessageCollector();
        collector.on('collect', m => {
            const user_content = m.content;
            m.delete()
            const user = interaction.guild.members.cache.get(user_content)

            if (user) {
                interaction.channel.edit({
                    permissionOverwrites: [{
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: idPessoa,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    {
                        id: user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    {
                        id: config.ticket.support_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    ]
                })
                interaction.editReply(`Usuário \`${user.user.tag}\` adicionado com sucesso!!`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 1000)
                })
                collector.stop()
            } else {
                interaction.editReply(`Usuário \`${user_content}\` não encontrado!`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 1000)
                })
                collector.stop()
            }
        });
    } else if (interaction.customId === 'remove_user') {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        const message = await interaction.reply(`Insira o id do usuário que você deseja remover!`)

        const collector = interaction.channel.createMessageCollector();
        collector.on('collect', m => {
            const user_content = m.content;
            m.delete()
            const user = interaction.guild.members.cache.get(user_content)

            if (user) {
                interaction.channel.edit({
                    permissionOverwrites: [{
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: idPessoa,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    {
                        id: user.id,
                        deny: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    {
                        id: config.ticket.support_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions", "ReadMessageHistory"],
                    },
                    ]
                })
                interaction.editReply(`Usuário \`${user.user.tag}\` removido com sucesso!!`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 1000)
                })
                collector.stop()
            } else {
                interaction.editReply(`Usuário \`${user_content}\` não encontrado!`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 1000)
                })
                collector.stop()
            }
        });
    } else if (interaction.customId === "transcript") {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        const guild = interaction.guild.id;
        const chan = interaction.channel.id;

        interaction.reply({
            content: 'Salvando mensagens...'
        }).then((msg) => {
            interaction.channel.messages.fetch().then(async (messages) => {
                let output = messages.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

                if (output.length < 1) output = "Nenhuma conversa aqui :)"

                try {
                    response = await sourcebin.create({
                        title: `Histórico do ticket: ${interaction.channel.name}`,
                        files: [{
                            content: output,
                            language: 'text',
                        },
                        ],
                    });
                }
                catch (e) {
                    console.log(e)
                    return interaction.message.channel.send('Ocorreu um erro. Por favor, tente novamente!');
                }

                let embed = new Discord.EmbedBuilder()
                    .setTitle(`📄 Historico de Ticket | ${interaction.channel.name}`)
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor("2f3136")
                    .addFields(
                        {
                            name: "Fechado Por:",
                            value: `${interaction.user}`,
                            inline: true
                        },
                        {
                            name: 'Canal:',
                            value: `\`${interaction.channel.name}\``,
                            inline: false
                        },
                        {
                            name: 'Protocolo:',
                            value: `\`${interaction.channel.id}\``,
                            inline: true
                        },
                        {
                            name: 'Histórico:',
                            value: `[Clique aqui](${response.url})`
                        },
                    )

                interaction.user.send({
                    embeds: [embed]
                }).then((msg) => {
                    interaction.editReply({
                        content: `Logs enviada com successo!`
                    }).then((m) => {
                        setTimeout(() => {
                            m.delete()
                        }, 5000);
                    });
                });
            });
        });
    } else if (interaction.customId === 'notify_user') {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("2f3136")
                    .setDescription(`Um staff está aguardando sua resposta no ticket <#${interaction.channel.id}>`)
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel('Ir para ticket')
                            .setURL(interaction.channel.url)
                    )
            ]
        })

        interaction.reply(`Usuário ${user} notificado com sucesso!`).then(m => {
            setTimeout(() => {
                interaction.deleteReply()
            }, 1000)
        })
    } else if (interaction.customId === 'pix') {
        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("2f3136")
                    .setDescription(`Chave pix: ${config.ticket.chave_pix}`)
                    .setImage(config.ticket.image_url)
            ], ephemeral: true
        })
    } else if (interaction.customId === 'delete') {
        const row = await db.get(`${interaction.channel.name.replace('🎫-', '')}`)
        const idPessoa = row;
        const user = await interaction.guild.members.fetch(idPessoa)

        const channel_voice = await interaction.guild.channels.cache.filter((c) => c.name === `${idPessoa}`);

        if (channel_voice) {
            channel_voice.delete();
        }

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("2f3136")
                    .setDescription(`<a:iconcarregando:1108187274279145572> ${interaction.member} Apagando ticket em 5 segundos!`)
            ]
        }).then(m => {
            setTimeout(() => {
                interaction.channel.messages.fetch().then(async (messages) => {
                    let output = messages.filter(m => m.author.bot !== true).map(m =>
                        `${new Date(m.createdTimestamp).toLocaleString('pt-BR')}-${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                    ).reverse().join('\n');

                    if (output.length < 1) output = "Nenhuma conversa aqui :)"

                    try {
                        response = await sourcebin.create({
                            title: `Histórico do ticket: ${interaction.channel.name}`,
                            files: [{
                                content: output,
                                language: 'text',
                            },
                            ],
                        });
                    }
                    catch (e) {
                        console.log(e)
                        return interaction.message.channel.send('Ocorreu um erro. Por favor, tente novamente!');
                    }

                    let embed = new Discord.EmbedBuilder()
                        .setTitle(`Historico de Ticket`)
                        .setThumbnail(client.user.displayAvatarURL({
                            dynamic: true
                        }))
                        .setColor("2f3136")
                        .addFields(
                            {
                                name: "Fechado Por:",
                                value: `${interaction.user}`,
                                inline: true
                            },
                            {
                                name: 'Canal:',
                                value: `\`${interaction.channel.name}\``,
                                inline: false
                            },
                            {
                                name: 'Protocolo:',
                                value: `\`${interaction.channel.id}\``,
                                inline: true
                            },
                            {
                                name: 'Histórico:',
                                value: `[Clique aqui](${response.url})`
                            },
                        )
                        .setImage(config.ticket.image_url);

                    logs = interaction.guild.channels.cache.get("1049516565038637116");

                    logs.send({
                        embeds: [embed], content: `Fechado por: ${interaction.member}`
                    });
                    db.delete(`${interaction.channel.name.replace('🎫-', '')}`)
                    interaction.channel.delete();
                });
            }, 5000)
        })
    }
});
/*============================= | Anti OFF | =========================================*/


process.on("uncaughtException", (err) => {
    console.log("⚠️ ERRO DETECTADO: " + err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("⚠️ ERRO DETECTADO: [GRAVE] Rejeição possivelmente não tratada em: Promise ", promise, " motivo: ", reason.message);
});