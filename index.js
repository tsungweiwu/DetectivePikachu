require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
});

var balls = ["PB", "GB", "UB", "PRB", "MB"]

client.on("message", message => {
    if (balls.includes(message.content.toUpperCase())) {
        setTimeout(function () {
            return message.channel.send("You can now catch another pokemon! " + "<@" + message.author + ">")
        }, 7650);
    }

    if (message.author === null) return

    if (message.author.id === "664508672713424926") {
        try {
            if(message.embeds[0].footer.text.includes("Shiny") || message.embeds[0].footer.text.includes("Legendary")) {
                console.log(message.embeds[0])

                let description = message.embeds[0].description.split("**")

                client.channels.cache.get('805288697527402506').send(message.url, {
                    embed: {
                        image: {
                            url: message.embeds[0].image.url
                        },
                        footer: {
                            text: message.embeds[0].footer.text
                        },
                        color: message.embeds[0].color,
                        title: description[1] + " found a " + description[3] + "!",
                    }
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    if (message.content === ';weak') {
        let attachment = new Discord.MessageAttachment('https://cdn.discordapp.com/attachments/802672605018062859/804803366264897546/unknown.png');
        try {
            return message.channel.send(attachment);
        } catch (err) {
            console.error(err);
        }
    }

    if (message.content === ';user') {
        try {
            return message.channel.send('List of GIFS', {
                embed: {
                    color: '#ff7b00',
                    description: '3 strong : ";b user 508692505810698241"\n'+
                    '2 strong : ";b user 714185208773214270"'
                }
            })
        } catch (err) {
            console.error(err);
        }
    }
})
