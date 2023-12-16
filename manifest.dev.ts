import { version } from './package.json'
const getManifest = () => ({
  "version": version + "-dev",
  "action": {
    "default_icon": "public/dev-icon-32.png"
  },
  "icons": {
    "128": "public/dev-icon-128.png"
  },
  "web_accessible_resources": [
    {
      "resources": [
        "dev-icon-128.png",
        "dev-icon-32.png"
      ],
      "matches": [
        "<all_urls>"
      ]
    }
  ]
})

export { getManifest }