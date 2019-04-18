const clova = require('@line/clova-cek-sdk-nodejs');

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
        const coffeeType = responseHelper.getSlot('coffeeType');
        const count = responseHelper.getSlot('count');

        // 返事を作成して返します
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText(`${coffeeType}を${count}つご用意します。`)
        ).endSession();
        
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
