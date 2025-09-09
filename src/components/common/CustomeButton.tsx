import { Button, ButtonProps } from '@chakra-ui/react';

interface CustomButtonProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  colorScheme?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'solid', 
  colorScheme = 'blue', 
  ...props 
}) => (
  <Button onClick={onClick} variant={variant} colorScheme={colorScheme} {...props}>
    {label}
  </Button>
);

export default CustomButton;