import { useEffect, useState } from 'react';
import '@/pages/options/Options.css';
import { defaultSettings, getOptions, setOption } from '@/utils/settings';
import { Label } from '@/components/ui/label';
import CleanModeSelector from '@/components/CleanModeSelector';
import URLFilterList from '@/components/URLFilterList';

const OptionsPage = (): JSX.Element => {
  const [settings, setSettings] = useState<typeof defaultSettings>(defaultSettings);
  const [initial, setInitial] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      setSettings(await getOptions())
      setInitial(true)
    })()
  }, [])

  useEffect(() => {
    if (initial) { setOption(settings) }
  }, [settings, initial])


  const onModifyUrllist = (action: 'add' | 'remove', url: string) => {

    if (action === 'add') {
      setSettings({ ...settings, cleanTargetUrl: [...(settings.cleanTargetUrl ?? []), url] })
    } else if (action === 'remove') {
      setSettings({
        ...settings,
        cleanTargetUrl: [...(settings.cleanTargetUrl ?? [])
          .filter(v => (v !== url))]
      })
    } else {
      // ignore unknown action type
      return
    }
  }

  if (!initial) {
    return <div>loading</div>
  }


  return (
    <div className="max-content m-auto min-h-screen relative h-screen">
      <div className='py-8'>
        {JSON.stringify(settings)}
        <h3 className='font-semibold leading-normal text-3xl mb-6'>History auto cleaner</h3>
        <div className="mb-5">
          <div className='flex justify-between items-center'>
            <Label htmlFor='autoCleanCheckbox'>Mode</Label>

            <CleanModeSelector defaultValue={settings.autoClean} onChange={(v) => {
              setSettings({ ...settings, autoClean: v })
            }} />
          </div>
        </div>

        <div className="mb-5">
          <URLFilterList onChange={onModifyUrllist} data={settings.cleanTargetUrl}></URLFilterList>
        </div>
        {/* <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
          </div>
          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button> */}
      </div>
    </div>
  );
}

export default OptionsPage
