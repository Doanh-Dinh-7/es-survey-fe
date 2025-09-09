import { HStack, Text, Switch } from '@chakra-ui/react'
import { FC } from 'react'

interface RequiredToggleProps {
  isRequired: boolean
  onToggle: (value: boolean) => void
  isReadOnly?: boolean
}

const RequiredToggle: FC<RequiredToggleProps> = ({ isRequired, onToggle, isReadOnly }) => {
  return (
    <HStack spacing={2}>
      <Switch
        isChecked={isRequired}
        onChange={(e) => onToggle(e.target.checked)}
        colorScheme={isReadOnly ? "gray" : "blue"}
        isDisabled={isReadOnly}
      />
      <Text fontSize="sm">Required</Text>
    </HStack>
  )
}

export default RequiredToggle
