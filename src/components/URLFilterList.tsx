
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef } from 'react';

type UrlListProps = {
	data: string[] | null
	onDelete: (target: string) => void
}

const UrlList = ({ data, onDelete }: UrlListProps): JSX.Element => {

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

interface Props {
	onChange: (action: 'add' | 'remove', url: string) => void
	data: string[] | null
}

const URLFilterList = ({ onChange, data = [] }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const removeFromList = (url: string) => {
		onChange('remove', url)
	}

	const addToList = () => {
		if (!inputRef.current) {
			throw new Error("invalid input")
		}

		const urlString: string = inputRef.current?.value;

		// not add empty
		if (!urlString || urlString.length === 0) {
			return;
		}

		// not add duplicate
		if (data?.indexOf(urlString) !== -1) {
			inputRef.current.value = ''
			return;
		}

		// save to state
		onChange('add', urlString)

		// clean up
		inputRef.current.value = ''
	}

	return (
		<>
			<div className='flex items-end mb-2'>
				<div className='flex-1 mr-4'>
					<Label htmlFor="urlFilter">Url filter</Label>
					<Input type="text" id="urlFilter" placeholder="Url domain" ref={inputRef} />
				</div>
				<div>
					<Button onClick={addToList} >Add</Button></div>
			</div>
			<div className='flex flex-col'>
				<UrlList data={data} onDelete={removeFromList}></UrlList>
			</div>
		</>

	)
}


export default URLFilterList