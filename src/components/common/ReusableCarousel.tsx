import { Box, Flex, IconButton } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, ReactNode, useRef } from "react";

interface ReusableCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemWidth?: string | number; // default 320px
}

function ReusableCarousel<T>({
  items,
  renderItem,
  itemWidth = "320px",
}: ReusableCarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollButtons();
    emblaApi.on("select", updateScrollButtons);
    emblaApi.on("reInit", updateScrollButtons);
  }, [emblaApi, updateScrollButtons]);

  return (
    <Box position="relative" w="full">
      <Flex align="center" gap={2} position="relative">
        <Box
          position="absolute"
          left={0}
          zIndex={2}
          h="min-content"
          display="flex"
          alignItems="center"
          pl={2}
          pr={0}
          transition="opacity 0.3s"
          _hover={{ opacity: 0.6 }}
        >
          <IconButton
            icon={<ChevronLeft />}
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            isDisabled={!canScrollPrev}
            variant="ghost"
            bg="transparent"
            boxShadow="none"
            border="none"
            _hover={{
              background: "none",
            }}
          />
        </Box>
        <Box
          overflowX="hidden"
          overflowY="visible"
          // ref={emblaRef}
          flex="1"
          position="relative"
          ref={(node) => {
            emblaRef(node);
            containerRef.current = node;
          }}
        >
          <Flex gap={4} px={1} position="relative">
            {items.map((item, index) => (
              <Box key={index} flex={`0 0 ${itemWidth}`} position="relative">
                {renderItem(item, index)}
              </Box>
            ))}
          </Flex>
        </Box>
        <Box
          position="absolute"
          right={0}
          zIndex={2}
          h="min-content"
          display="flex"
          alignItems="center"
          pr={2}
          pl={0}
          transition="opacity 0.3s"
          _hover={{ opacity: 0.6 }}
        >
          <IconButton
            icon={<ChevronRight />}
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            isDisabled={!canScrollNext}
            variant="ghost"
            bg="transparent"
            boxShadow="none"
            border="none"
            _hover={{
              background: "none",
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default ReusableCarousel;
