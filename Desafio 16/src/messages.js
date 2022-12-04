const fs = require("fs");

class Messages {
  constructor(filename) {
    this.filename = filename;
  }

  async allMessages() {
    try {
      const messagesBase = await fs.promises.readFile(this.filename, "utf-8");
      console.log(messagesBase);
      if (messagesBase.length > 0) {
        let messagesChange = JSON.parse(messagesBase);

        return messagesChange;
      } else {
        return "No hay mensaj";
      }
    } catch (error) {
      console.log("error");
    }
  }

  async newMessage(message) {
    try {
      console.log("ok");
      console.log(message);
      const messagesBefore = await this.allMessages();
      console.log(messagesBefore);
      const messagesAfter = [...messagesBefore, message];
      console.log(messagesAfter);
      await fs.promises.writeFile(
        this.filename,
        JSON.stringify(messagesAfter, null, 2)
      );
      return messagesAfter;
    } catch (error) {
      console.log("error");
    }
  }
}

module.exports = Messages;
