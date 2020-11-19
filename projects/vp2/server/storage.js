const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data.json');

class Storage {
    constructor() {
        if (!fs.existsSync(dataPath)) {
            fs.writeFileSync(dataPath, '{}');
            this.data = {};
        } else {
            this.data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
    }

    saveUser(data) {
        this.data[data.user] = data.avatar;
        this.updateStorage();
    }

    getUsers() {
        return this.data;
    }

    getUser(data) {
        return this.data[data.user] || '';
    }

    updateStorage() {
        fs.writeFile(dataPath, JSON.stringify(this.data), () => {
        });
    }
}

module.exports = Storage;
