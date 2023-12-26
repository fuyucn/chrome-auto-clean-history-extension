import { version } from './package.json'

const getManifest = () => ({
  "manifest_version": 3,
  "name": "Auto history cleaner",
  "description": "Auto history clean",
  "version": version,
  "options_ui": {
    "page": "src/pages/options/index.html",
    "open_in_tab": true
  },
  "background": {
    "service_worker": "src/pages/background/index.ts",
    "type": "module"
  },
  "action": {
    "default_title": "Click to show an alert",
    "default_popup": "src/pages/popup/index.html",
    "default_icon": {
      "32": "icon-32.png"
    }
  },
  "icons": {
    "128": "icon-128.png"
  },
  "permissions": [
    "activeTab",
    // "debugger",
    "scripting",
    "history",
    "storage",
    "browsingData",
  ],
  "devtools_page": "src/pages/devtools/index.html",
  "web_accessible_resources": [
    {
      "resources": [
        "icon-128.png",
        "icon-32.png"
      ],
      "matches": []
    }
  ]
})


export { getManifest }