import type { ReactNode } from "react"

type Props = {
	children: ReactNode
}

const Title = ({ children }: Props) => {
	return <span className="text-sm font-medium leading-6 text-gray-900">{children}</span>
}

export default Title