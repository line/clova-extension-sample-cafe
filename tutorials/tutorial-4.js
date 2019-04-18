const clova = require('@line/clova-cek-sdk-nodejs');
const { CHANNEL_ACCESS_TOKEN } = require('../config.js');

// LINEメッセンジャーAPI
const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: CHANNEL_ACCESS_TOKEN
})

const clovaSkillHandler = clova.Client
  .configureSkill()
  // スキルが起動したときに呼び出されます
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech(
      clova.SpeechBuilder.createSpeechText('ご注文は何にしましょうか？')
    );
  })
  // スキルに話しかけたときに呼び出されます
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();

    switch (intent) {
      // OrderIntentだったときに、スロットのデータを用いて返事をします
      case 'OrderIntent':
        // スロットからユーザーの注文情報を取得します
        // coffeeType はスロットに無ければ、sessionAttributes から取得してみます。どちらも無い場合は、null になります。
        const coffeeType = responseHelper.getSlot('coffeeType') ? responseHelper.getSlot('coffeeType') : responseHelper.getSessionAttributes().coffeeType;
        const count = responseHelper.getSlot('count');

        if (coffeeType && count) {
          // 注文情報を用いて返事をします。返事した後でセッションを切ります。
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(`${coffeeType}を${count}つご用意します。`)
          ).endSession();

          // ユーザーIDを用いてLINEに領収証を送信します。
          client.pushMessage(responseHelper.getUser().userId, {
            type: 'text',
            text: `${coffeeType} ${count}杯 ${120 * count}円`,
          }).catch(err => {
            console.log(err.message);
          });
          
        } else if (coffeeType && !count) {
          // 注文にはコーヒー種類だけが入っています。数も必要なので、ユーザーに尋ねて、セッションを切りません。
          responseHelper.setSimpleSpeech(
            clova.SpeechBuilder.createSpeechText(`いくつの${coffeeType}をご用意しましょうか？`)
          ).setSessionAttributes({
            // コーヒー種類を SessionAttribute として保持しておきます。
            // 次回からユーザーがcofeeTypeを発話しなくても覚えることができます。
            coffeeType: coffeeType
          });
        }
        break;
      // その他のインテントの場合
      default:
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('もう一度お願いします。')
        );
        break;
    }
  })
  // スキルが終了するときに呼び出されます
  .onSessionEndedRequest()
  .handle();

module.exports = clovaSkillHandler;
