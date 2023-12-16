import React, { useEffect, useMemo, useState } from 'react';
import { ReloadIcon } from "@radix-ui/react-icons"
import Title from '../../components/Title';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getHistory, deleteHistory } from '@/utils/chrome';
import { SettingObject, getOptions, setOption } from '@/utils/settings';



export default function Popup(): JSX.Element {
  const [isCleaning, setCleaning] = useState(false)
  const [addCurrentTabMsg, setAddCurrentTagMsg] = useState("")
  const [currentUrl, setCurrentUrl] = useState<string>()
  const [settings, setSettings] = useState<SettingObject>()

  useEffect(() => {
    (async () => {
      const res = await getOptions();
      setSettings(res)
    })();
    (async () => {
      const res = await getCurrentTab();
      if (res && res.url) {
        const url = new URL(res.url)
        setCurrentUrl(url.host)
        console.log("HERER", url.host)
      }
    })();
  }, [])

  const onClean = async () => {
    setCleaning(true)
    const { cleanTargetUrl } = await chrome.storage.sync.get('cleanTargetUrl')

    console.log("Start Clean", cleanTargetUrl)

    await Promise.all(cleanTargetUrl.map((url: string) => {
      return deleteHistory({ url: url })
    }))
    setTimeout(() => { setCleaning(false) }, 300)
  }

  const urlList = useMemo(() => {
    return <div></div>
    // return list.map((url, idx) => {
    //   // const count = await getHistory({ url }).length;
    //   return <div key={idx} className='flex flex-row'>
    //     <div className='flex-1 text-ellipsis'>{url}</div>
    //     <div className='w-5'>1</div>
    //   </div>

    // })
  }, [])


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

    if (settingUrls?.indexOf(url.host) === -1) {
      settingUrls.push(url.host)
      settings.cleanTargetUrl = settingUrls
      await setOption(settings)
    }

    setAddCurrentTagMsg("success")
  }


  const currentUrlExisted = useMemo(() => {
    console.log(currentUrl, settings?.cleanTargetUrl)
    if (!currentUrl) return false;
    return settings?.cleanTargetUrl?.includes(currentUrl)
  }, [currentUrl, settings?.cleanTargetUrl])


  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-50">
      <div className="flex flex-row ">
        <Title>Clean</Title>
        <div className='flex-1 flex justify-end'>
          <Button onClick={() => onClean()} disabled={isCleaning} size='sm'>
            {isCleaning ? <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Wait</> : "Clean"}
          </Button>
        </div>
      </div>
      <div className='flex flex-row'>
        <Checkbox />
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row text-start'>
          <Title>List</Title>
        </div>
      </div>
      <div className='flex flex-col'>
        {urlList}
      </div>
      <div>
        {currentUrlExisted ? <div>Hostname already existed</div> :
          <Button onClick={() => { addCurrentTab() }}>Add Current Tab</Button>}
        {addCurrentTabMsg && addCurrentTabMsg.length > 0 && "Sucecss"}</div>
    </div>
  );
}