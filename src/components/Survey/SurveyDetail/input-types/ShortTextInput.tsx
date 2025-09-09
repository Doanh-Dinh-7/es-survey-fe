import { Input } from '@chakra-ui/react'
import { FC } from 'react'

interface Props {
  value?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
}

const ShortTextInput: FC<Props> = ({ value = '', onChange, isDisabled = false }) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Short answer text"
      isDisabled={isDisabled}
    />
  )
}

export default ShortTextInput
