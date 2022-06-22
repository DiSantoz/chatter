//  adding new chat documents
class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection("chats");
    this.unsub;
  }
  async addChat(message) {
    // chat object
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };
    // save chat documents
    const response = await this.chats.add(chat);
    return response;
  }
  // setting up a real-time listener to get new chats
  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // update UI
            callback(change.doc.data());
          }
        });
      });
  }
  // updating username
  updateName(username) {
    this.username = username;
  }
  // updating room
  updateRoom(room) {
    this.room = room;
    console.log(`room updated to ${room}`);
    if (this.unsub) {
      this.unsub();
    }
  }
}

const chatroom = new Chatroom("general", "faruq");

chatroom.getChats((data) => {
  console.log(data);
});

setTimeout(() => {
  chatroom.updateRoom("gaming");
  chatroom.updateName("yosi");
  chatroom.getChats((data) => {
    console.log(data);
  });
  chatroom.addChat("hello");
}, 3000);
