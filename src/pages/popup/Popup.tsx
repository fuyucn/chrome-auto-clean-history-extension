import { ReloadIcon } from "@radix-ui/react-icons"
import Title from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getHistory, deleteHistory, deleteBrowsingData } from '@/utils/chrome';
import { SettingObject, getOptions, setOption } from '@/utils/settings';
import { useState, useEffect, useMemo } from 'react'


export default function Popup(): JSX.Element {
  const [isCleaning, setCleaning] = useState(false)
  const [addCurrentTabMsg, setAddCurrentTagMsg] = useState("")
  const [currentUrl, setCurrentUrl] = useState<string>()
  const [settings, setSettings] = useState<SettingObject>()
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    (async () => {
      const res = await getOptions();
      setSettings(res)
    })();

    (async () => {
      const res = await getCurrentTab();
      if (res && res.url) {
        const url = new URL(res.url)
        setCurrentUrl(url.origin)
      }
    })();
  }, [])

  const onClean = async () => {
    setCleaning(true)
    setSuccessMsg('')
    const { cleanTargetUrl } = await chrome.storage.sync.get('cleanTargetUrl')

    console.debug("Start Clean", cleanTargetUrl)

    const results = await Promise.all(cleanTargetUrl.map((url: string) => {
      return deleteHistory({ url: url })
    }))

    await Promise.all(cleanTargetUrl.map((url: string) => {
      return deleteBrowsingData({ url })
    }))

    const deletedCount = results
      .map(r => r.count)
      .reduce((p, cur) => {
        return p + cur
      }, 0)

    setTimeout(() => {
      setCleaning(false);
      setSuccessMsg("Success deleted " + deletedCount)
    }, 300)

  }


  const getCurrentTab = async () => {
    const curTabs = await chrome.tabs.query({ active: true })

    const activeTab = curTabs.find(tab => tab.url !== undefined)

    return activeTab
  }

  const addCurrentTab = async () => {
    const activeTab = await getCurrentTab()
    if (!activeTab) return;
    const url: URL = new URL(activeTab.url as string)
    const settings = await getOptions();
    const settingUrls = settings.cleanTargetUrl ?? []

    const { origin } = url

    if (settingUrls?.indexOf(origin) === -1) {
      settingUrls.push(origin)
      settings.cleanTargetUrl = settingUrls
      await setOption(settings)
    }

    setAddCurrentTagMsg("success")
  }


  const currentUrlExisted = useMemo(() => {
    if (!currentUrl) return false;
    console.debug(currentUrl, settings?.cleanTargetUrl, settings?.cleanTargetUrl,
      settings?.cleanTargetUrl?.includes(currentUrl))
    return settings?.cleanTargetUrl?.includes(currentUrl)
  }, [currentUrl, settings?.cleanTargetUrl])


  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-50 flex flex-col">
      <div className="flex flex-row ">
        <Title>Clean</Title>
        <div className='flex-1 flex justify-end'>
          <Button onClick={() => onClean()} disabled={isCleaning} size='sm'>
            {isCleaning ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Wait</> : "Clean"}
          </Button>
        </div>
      </div>
      <div>
        {successMsg && successMsg.length > 0 && <div className="text-xs text-gray-400 text-right leading-6">{successMsg}</div>}
      </div>
      <div className="mt-6 flex-1 flex items-end justify-center">
        {(!addCurrentTabMsg || addCurrentTabMsg.length === 0)
          && (
            currentUrlExisted ?
              <div className="font-semibold font-mono text-sm text-emerald-600" >Hostname already existed</div> :
              <Button variant={'ghost'} onClick={() => { addCurrentTab() }}>Add Current Tab</Button>
          )
        }
        {addCurrentTabMsg && addCurrentTabMsg.length > 0 && <span className="font-semibold font-mono text-sm text-emerald-600">Success</span>}</div>
    </div>
  );
}