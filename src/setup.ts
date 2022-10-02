const token = process.env.TOKEN
import fs from 'fs'

const data = `{
  "token": "${token}",
  "slash": {
    "guild": "953302487065034785"
  }
}
`

fs.writeFileSync('./config.json', data)
