import React, { useCallback, useEffect, useState, useRef } from 'react';
import '@/pages/options/Options.css';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { defaultSettings, getOptions, setOption } from '@/utils/settings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  data: string[] | null
  onDelete: (target: string) => void
}

const UrlFilterList = ({ data, onDelete }: Props): JSX.Element => {

  if (!data || data.length === 0) {
    return <div>None</div>
  }
  return (
    <div>
      {data.map((d, idx) => {
        return <div key={idx} className='group flex flex-row justify-start mb-1 font-normal text-sm'>
          <div>{d}</div>
          <div className='ml-2'>
            <Button
              variant={'link'}
              onClick={() => { onDelete(d) }}
              className="group-hover:visible invisible px-0 py-0 no-underline h-auto hover:no-underline hover:text-red-500" >Delete</Button>
          </div>
        </div>
      })}
    </div>
  )
}

const OptionsPage = (): JSX.Element => {
  const [settings, setSettings] = useState<typeof defaultSettings>(defaultSettings);
  const [initial, setInitial] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    (async () => {
      setSettings(await getOptions())
      setInitial(true)
    })()
  }, [])

  useEffect(() => {
    if (initial) { setOption(settings) }
  }, [settings, initial])

  const addToList = () => {
    if (!inputRef.current) {
      throw new Error("invalid input")
    }

    const currentInput: string = inputRef.current?.value;

    // not add empty
    if (!currentInput || currentInput.length === 0) {
      return;
    }

    // not add duplicate
    if (settings.cleanTargetUrl?.indexOf(currentInput) !== -1) {
      inputRef.current.value = ''
      return;
    }

    // save to state
    setSettings({ ...settings, cleanTargetUrl: [...(settings.cleanTargetUrl ?? []), currentInput] })
    // clean up
    inputRef.current.value = ''
  }
  const removeFromList = (target: string) => {
    setSettings({
      ...settings,
      cleanTargetUrl: [...(settings.cleanTargetUrl ?? [])
        .filter(v => (v !== target))]
    })
  }

  if (!initial) {
    return <div>loading</div>
  }

  return (
    <div className="max-content m-auto my-8">
      <h3 className='font-semibold leading-normal text-5xl mb-6'>History auto cleaner</h3>
      <div className="mb-5">
        <Checkbox
          defaultChecked={settings.autoClean}
          onCheckedChange={(v: boolean) => {
            setSettings({ ...settings, autoClean: v })
          }}>Auto clean</Checkbox>
      </div>

      <div className="mb-5">
        <div className='flex items-center mb-2'>
          <div className='flex-1 mr-4'>
            <Label htmlFor="urlFilter">Url filter</Label>
            <Input type="text" id="urlFilter" placeholder="Url domain" ref={inputRef} />
          </div>
          <div>
            <Button onClick={addToList} variant='secondary'>Add</Button></div>
        </div>
        <div className='flex flex-col'>
          <UrlFilterList data={settings.cleanTargetUrl} onDelete={removeFromList}></UrlFilterList>
        </div>
      </div>
      {/* <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
          </div>
          <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button> */}
    </div>
  );
}

export default OptionsPage
