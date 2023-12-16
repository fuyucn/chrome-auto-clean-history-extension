export type SettingObject = { autoClean: boolean, cleanTargetUrl: string[] | null }

export const defaultSettings: SettingObject = {
	autoClean: false,
	cleanTargetUrl: []
}

export const getOptions = async () => {
	const results = await chrome.storage.sync.get(Object.keys(defaultSettings))

	console.log(results)
	return { ...defaultSettings, ...results }
}

export const setOption = async (newValue: typeof defaultSettings) => {
	return chrome.storage.sync.set({ ...newValue })
}
