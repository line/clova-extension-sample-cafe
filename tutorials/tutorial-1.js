const clova = require('@line/clova-cek-sdk-nodejs');

const clovaSkillHandler = clova.Client
  .configureSkill()
  // スキルが起動したときに呼び出されます
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech(
      clova.SpeechBuilder.createSpeechText('スキルが起動しました。')
    );
  })
  // スキルに話しかけたときに呼び出されます
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();

    switch (intent) {
      // GreetingIntentだったときに、"はい、こんにちは"と返事をします
      case 'GreetingIntent':
        responseHelper.setSimpleSpeech(
          clova.SpeechBuilder.createSpeechText('はい、こんにちは。')
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
