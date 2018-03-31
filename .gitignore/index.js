const Discord = require('discord.js');
const bot = new Discord.Client();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write();

var prefix = ("?");

bot.on('ready',function() {
    bot.user.setGame("Use ?help" );
    console.log("Connected");
});

bot.login(process.env.TOKEN);


bot.on("guildMemberAdd", member => {
    member.guild.channels.find("name","welcome").send(`Bienvenue ${member}`);


})
bot.on("guildMemberRemove", member => {
    member.guild.channels.find("name","welcome").send(`${member} vient de quitter`);
})

bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.find('name','Membres');
    member.addRole(role);
})

bot.on('message', message => {
    if(message.content === prefix + "help"){
        message.channel.send('Liste des commandes : \n - ?help \n - ?xp \n - ?infodiscord');
    }

    if(message.content === prefix + "infodiscord"){
        var embed1 = new Discord.RichEmbed()
        .setDescription("Information du Discord")
        .addField("Nom du discord", message.guild.name)
        .addField("Créer le", message.guild.createdAt)
        .addField("Tu as rejoins le", message.member.joinedAt)
        .addField("Utilisateurs sur le discord", message.guild.memberCount)
        .setColor("0x0000FF")
        message.channel.sendEmbed(embed1);
    }

    if(message.content === "Salut"){
        message.reply("Bonjour à toi jeune dresseur");
        console.log("Commande Bonjour effectué");
    } 
   var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else {
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb);
        console.log(userxp);
        console.log(`Nombre d'xp: ${userxp[1]}`);
        
        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

        if (message.content === prefix + "xp"){
            var xp = db.get("xp").filter({user: msgauthor}).find('xp').value();
            var xpfinal = Object.values(xp);
            var xp_embed = new Discord.RichEmbed()
                    .setTitle(`Stats des XP de ${message.author.username}`)
                    .setColor('#F4D03F')
                    .setDescription("Affichage des XP")
                    .addField("XP:",  `${xpfinal[1]}xp`)
                    .setFooter("Enjoy");
                    message.channel.send({embed: xp_embed});
        }}})
