require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const schedule = require('node-schedule')
const fs = require('fs');

client.login("");

// reset
var resetRule = new schedule.RecurrenceRule();
resetRule.hour = 00;
resetRule.minute = 00;
resetRule.tz = 'America/New_York';
//50 12 * * *
var resetCatch = schedule.scheduleJob(resetRule, function() {
    let output = "";
    var d = new Date(); // Today!
    d.setDate(d.getDate() - 1); // Yesterday!
    var n = d.getDay();

    for (var i = 0, keys = Object.keys(dailyCatches), ii = keys.length; i < ii; i++) {
        output += keys[i] + " : " + dailyCatches[keys[i]] + "\n";
    }

    const list = new Discord.MessageEmbed()
        .setTitle('Catches Today ' + d.getDate())
        .setColor('#0099ff')
        .setDescription(output);
    client.channels.cache.get('802672605018062859').send(list);

    dailyCatches = {};
    writePoke();
})

var dailyCatches = {};
var duplicateMsg;

function readPoke() {
    fs.readFile('dailyCatches.json', 'utf8', (error, data) => {
        if (error) {
            console.error(error);
            return;
        }
        let jsonObject = JSON.parse(data);
        for (var value in jsonObject) {
            dailyCatches[value] = jsonObject[value];
        }
    })
}

function writePoke() {
    let jsonObject = {};

    for (var i = 0, keys = Object.keys(dailyCatches), ii = keys.length; i < ii; i++) {
        jsonObject[keys[i]] = dailyCatches[keys[i]];
    }

    fs.writeFile('dailyCatches.json', JSON.stringify(jsonObject), error => {
        if (error) {
            console.error(error);
            return;
        }})
}


client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}! v2`);

    readPoke();

    resetCatch.schedule();

    client.on('messageUpdate', (oldMessage, newMessage) => {
        if (newMessage.author.id === client.user.id) return;
        if (newMessage === duplicateMsg) return;
        if (newMessage.author.id !== "664508672713424926") return;

        try {
            var lastEditName = newMessage.embeds[0].author.name.slice(17, newMessage.embeds[0].author.name.length - 1);

            var lastEditDesc = newMessage.embeds[0].description;

            if (lastEditDesc.includes('You caught')) {
                dailyCatches[lastEditName] = (dailyCatches[lastEditName] + 1) || 1;
                duplicateMsg = newMessage;
                writePoke();
            }
        } catch (e) {
            console.log(e)
        }
    })


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
                let description = message.embeds[0].description.split("**")

                client.channels.cache.get('805288697527402506').send({
                    embed: {
                        image: {
                            url: message.embeds[0].image.url
                        },
                        footer: {
                            text: message.embeds[0].footer.text
                        },
                        color: message.embeds[0].color,
                        title: description[1] + " found a " + description[3] + "!",
                        description: "[Link to Message](" + message.url + ")"
                    }
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    if (message.content === ';score') {
        // console.log(dailyCatches.get(message.author.username))
        readPoke();
        return message.channel.send('Your catches today: ' + (dailyCatches[message.author.username] === undefined ? '0' : dailyCatches[message.author.username]));
    }

    if (message.content === ';score all') {
        // console.log(dailyCatches.get(message.author.username))
        readPoke();
        var output = "";
        for (var i = 0, keys = Object.keys(dailyCatches), ii = keys.length; i < ii; i++) {
            output += keys[i] + " : " + dailyCatches[keys[i]] + "\n";
        }

        const list = new Discord.MessageEmbed()
            .setTitle('Catches Today')
            .setColor('#0099ff')
            .setDescription(output);

        return message.channel.send(list);
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
            return message.channel.send('Training NPCs', {
                embed: {
                    color: '#ff7b00',
                    fields: [
                        {
                            name: "Two Chancy's",
                            value: ";b user 714185208773214270"
                        },
                        {
                            name: "Three Chancy's",
                            value: ";b user 508692505810698241"
                        },
                        {
                            name: "Gopi's Training Acc",
                            value: ";b user 269648177093672963"
                        }
                    ]
                }
            })
        } catch (err) {
            console.error(err);
        }
    }
})
