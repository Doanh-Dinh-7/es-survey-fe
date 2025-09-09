import { Button, Center } from '@chakra-ui/react'
import { FC } from 'react'
import { BiPlus } from 'react-icons/bi'

interface AddQuestionButtonProps {
  onClick: () => void
}

const AddQuestionButton: FC<AddQuestionButtonProps> = ({ onClick }) => {
  return (
    <Center mt={4}>
      <Button
        leftIcon={<BiPlus />}
        colorScheme="teal"
        variant="solid"
        onClick={onClick}
      >
        Add Question
      </Button>
    </Center>
  )
}

export default AddQuestionButton
