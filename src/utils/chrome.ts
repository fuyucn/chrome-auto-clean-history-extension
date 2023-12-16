

type Opts = {
	regexs?: string[]
	url?: string
}

export const getHistory = async (options?: Opts): Promise<chrome.history.HistoryItem[]> => {
	const { url = "" } = options ?? {};
	const microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
	const oneWeekAgo = new Date().getTime() - microsecondsPerWeek;
	const numRequestsOutstanding = 0
	return chrome.history.search(
		{
			text: url, // Return every history item....
			// startTime: oneWeekAgo, // that was accessed less than one week ago.
			maxResults: 999999999
		},

	);

}

export const deleteHistory = async ({ regexs, url }: Opts) => {
	if (!url) return;
	const historyItems = await getHistory({ url })
	console.debug('Deleting, found: ' + url, historyItems.length)
	const deleted = await Promise.all(historyItems.map(item => item.url && chrome.history.deleteUrl({ url: item.url })))
	return { result: deleted.length === historyItems.length, count: deleted.length }
}
