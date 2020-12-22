const Discord = require("discord.js");
const ytdl = require("ytdl-core")
const Client = new Discord.Client;

Client.login("NzkwNzA4MTUzMTk2MDg1MzA4.X-EiWg.kQufDXtlkXr2teEyVe8IzmWuMPg");

const prefix = "!";

var list = [];

Client.on("ready", () =>{
    console.log("bot opérationnel");
});

Client.on("message",  async message => {
    if(message.member.permissions.has("MANAGE_MESSAGES")){
        if(message.content.startsWith(prefix + "clear")){
            let numb = message.content.split (" ");

            if(numb[1] == undefined){
                message.reply("nombre de messages non defini !");

            }
            else{
                let number = parseInt(numb[1]);

                if(isNaN(number)){
                    message.reply("nombre de messages non defini !");
                }
                else{
                    message.channel.bulkDelete(number).then(messages => {
                        console.log("message suprime : " + message.size + " reussi !!");
                    }).catch(err => {
                        console.log("erreur de clear : " + err);
                    });
                }
            }
        }
    };



    if(message.content === prefix + "list"){
        let msg = "**FILE D'ATTENTE !**\n";
        for(var i = 0;i < list.length;i++){
            let name;
            await ytdl.getInfo(list[i], (err, info) => {
                if(err){
                    console.log("erreur de lien : " + err);
                    list.splice(i, 1);
                }
                else{
                    name = info.title;
                }
            });
            msg += "> " + i + " - " + name +"\n";
        }
        message.channel.send(msg);
    }
    if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            let args = message.content.split(" ");

            if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                message.reply("lien de la vidéo non ou mal mentionné.");
            }
            else{
                if(list.length > 0){
                    list.push(args[1]);
                    message.reply("vidéo ajouté a la liste.");
                }
                else{
                    list.push(args[1]);
                    message.reply("vidéo ajouté a la liste.");

                    message.member.voice.channel.join().then(connection => {
                     playMusic(connection);

                        connection.on("disconnect", () => {
                            list = [];
                        });



                    }).catch(err => {
                        message.reply("erreur lors de la connexion : " + err);
                    });
                }
            }
        }
   
    }
    

});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality: "highestaudio"}));

    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else{
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
        console.log("erreur de dispatcher : " + err);
        dispatcher.destroy();
        connection.disconnect();
    });
}

 