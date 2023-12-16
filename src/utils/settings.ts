
export const CLEAN_MODES = {
	'AUTO': 'auto',
	// 'AFTER_CLOSE': 'after close',
	"MANUAL": "manual"
}

export type AutoClean = keyof typeof CLEAN_MODES;

export type SettingObject = { autoClean: AutoClean, cleanTargetUrl: string[] | null }


export const defaultSettings: SettingObject = {
	autoClean: "MANUAL",
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
