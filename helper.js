async function sendToChat(client, chatId, message) {
  try {
    await client.sendMessage(chatId, { message: message });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

async function receiveMessages() {
  const client = await authorize();
  await client.sendMessage("me", { message: "oт user bot" });
}

function transformChatId(inputStr) {
  const withoutFirstThreeDigits = inputStr.substring(4);

  const result = withoutFirstThreeDigits;
  return result;
}

module.exports = {
  transformChatId,
  sendToChat,
  receiveMessages,
};
