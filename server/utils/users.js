// [{
//   id: '/#778778bjh',
//   name: "Zara Larsson",
//   room: "Music"
// }]

// addUser(id, name, room);
// removeUser(id);
// getUser(id);

class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    let user = {id, name, room};
    this.users.push(user);
    return user;
  }
  changeRoom (id, name) {
    let  user = getUser(id);

    if(user) {
      this.users = this.users.filter(user => user.id !== id);
      this.users.push(user);
    }
  }
  removeUser (id) {
    let user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    return this.users.filter(user => user.id === id)[0]
  }
  getUserList (room) {
    let users = this.users.filter(user => user.room === room);
    let namesArray = users.map(user => user.name);

    return namesArray;
  }
}

module.exports = { Users };