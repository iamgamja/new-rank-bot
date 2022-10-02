const token = process.env.TOKEN
const fs = require('fs');

const data = `{
  "token": "${token}",
  "slash": {
    "guild": "953302487065034785"
  }
}
`

fs.writeFileSync('./config.json', data)
