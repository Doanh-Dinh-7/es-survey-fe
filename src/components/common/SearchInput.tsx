import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { IoSearchCircle } from "react-icons/io5";

interface SearchInputProps {
  placeholder: string;
  handleSearch: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, handleSearch }) => {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<IoSearchCircle color="#607AFB"  size={70}/>}
      />
      <Input placeholder={placeholder}  onChange={(e) => handleSearch(e.target.value)}/>
    </InputGroup>
  );
};

export default SearchInput;