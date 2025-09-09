import { Textarea } from '@chakra-ui/react'
import { FC } from 'react'

interface Props {
  value?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
}

const LongTextInput: FC<Props> = ({ value = '', onChange, isDisabled = false }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Long answer text"
      isDisabled={isDisabled}
      minH="100px"
    />
  )
}

export default LongTextInput
