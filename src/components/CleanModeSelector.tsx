import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { AutoClean, CLEAN_MODES } from '@/utils/settings'


interface Props {
	defaultValue: AutoClean,
	onChange?: (v: AutoClean) => void
}

const CleanModeSelector = ({ defaultValue, onChange }: Props) => {
	const [mode, setMode] = useState<string>(defaultValue)

	const list = Object.keys(CLEAN_MODES) as (keyof typeof CLEAN_MODES)[]

	const getName = (key: AutoClean) => {
		return CLEAN_MODES[key].toUpperCase()
	}

	const onChangeMode = (mode: string | AutoClean) => {
		setMode(mode)
		onChange && onChange(mode as AutoClean)
	}

	return (

		<Tabs defaultValue={mode} onValueChange={onChangeMode}>
			<TabsList>
				{list.map((l) => {
					return (<TabsTrigger key={l} value={l}>
						{getName(l)}
					</TabsTrigger>)
				})}
			</TabsList>
		</Tabs>
	);
}

export default CleanModeSelector