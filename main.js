const telegram = require("telegram");
const input = require("input");
const path = require("path");
const fs = require("fs");

const config = require("./config");
const { sendToChat, transformChatId } = require("./helper");

const keywordMappings = [
  "потолок",
  "потолка",
  "потолку",
  "потолок",
  "потолком",
  "потолки",
  "потолков",
];

const {
  telegram_credentials: { apiId, apiHash },
  chatIdSubsribe,
  chatIdToSend,
} = config;
const storeSession = new telegram.sessions.StoreSession("my_session");
async function authorize() {
  const client = new telegram.TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.connect();
  await client.connect();
  if (await client.checkAuthorization()) {
    console.log("I am logged in!");
  } else {
    console.log(
      "I am connected to telegram servers but not logged in with any account. Let's autorize"
    );
    await client.start({
      phoneNumber: async () => await input.text("number ?"),
      password: async () => await input.text("password?"),
      phoneCode: async () => await input.text("Code ?"),
      onError: (err) => console.log(err),
    });
    client.session.save();
    console.log("You should now be connected");
  }
  return client;
}

(async () => {
  const client = await authorize();

  ///// write you code here
  client.addEventHandler(async (event) => {
    const message = event.message;
    const peerId = message?.peerId?.channelId?.value; // id группы
    const messageText = message?.message?.toLowerCase(); 
    
  //   const msgs = await client.getMessages(chatIdSubsribe, {
  //     limit: 10,
  // });
  // console.log("ggggggggggggggggggggggggggggggggggg", msgs)
    // console.log("event>>>>>>>>>>>", event);

    if (transformChatId(chatIdSubsribe) == String(peerId)) {
      console.log("мы в нужном чате", peerId)
      const idMessage = message?.id;
      const url = `https://t.me/c/${peerId}/${idMessage}`;

      const containsKeyword = keywordMappings.some((item) => {
        return messageText.includes(item);
      });



      if (containsKeyword) {
        await client.sendMessage(chatIdToSend, {
          message: "В строительном чате пишут о потолках" + url,
        });
        console.log("you message has been send");

        // Отправляем сообщение с ссылкой на оригинальное сообщение
      }
    }
  });
})();



//const url = `https://t.me/c/1848424988/${messageId}`;
