const { Event } = require('klasa');
const Moment = require('moment');

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'guildMemberRemove',
      enabled: true,
      event: 'guildMemberRemove',
      once: false,
    });
  }

  run(mem) {
    try {
      if (mem.guild.configs.goodbyeMessage && mem.guild.configs.goodbyeMemberActive && mem.guild.configs.goodbyeChannel) {
        const chan = mem.guild.channels.find('id', mem.guild.configs.goodbyeChannel);
        let message = mem.guild.configs.goodbyeMessage;
        message = message.replace('$MENTION$', mem.user);
        message = message.replace('$SERVER$', mem.guild);
        chan.send(message).catch(err => console.log(err, 'error'));
      }

      if (mem.guild.configs.logMemberRemove && mem.guild.configs.guildMemberRemoveChannel) {
        const memChan = mem.guild.channels.find('id', mem.guild.configs.guildMemberRemoveChannel);
        if (!memChan) return;
        const avatar = mem.user.displayAvatarURL() ? mem.user.displayAvatarURL() : mem.guild.iconURL();
        const embed = new this.client.methods.Embed()
          .setColor('#ff003c')
          .setTitle('Member Left')
          .setThumbnail(avatar)
          .setAuthor(`${mem.user.tag} / ${mem.user.id}`, avatar)
          .addField('Joined At', `${Moment.utc(mem.joinedTimestamp).format('llll')} UTC-0`)
          .addField('Left At', `${Moment.utc(new Date()).format('llll')} UTC-0`)
          .addField('Account Age', `${Moment.utc(mem.user.createdAt).format('llll')} UTC-0`)
          .setTimestamp();
        memChan.send({ embed }).catch(err => console.log(err, 'error'));
      }
    } catch (error) { console.log(error); }
    console.log(`Member Left:\n\t'Member: ${mem.user.tag}'\n\t'Guild:  ${mem.guild.name}'\n\tAge:    '${mem.user.createdAt}'.`);
  }
};