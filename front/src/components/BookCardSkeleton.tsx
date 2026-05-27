import { Box, Skeleton, SkeletonText } from '@chakra-ui/react';

interface BookCardSkeletonProps {
  wrap?: boolean;
}

const BookCardSkeleton = ({ wrap = true }: BookCardSkeletonProps) => (
  <Box w={{ base: wrap ? '150px' : '140px', md: wrap ? 'auto' : '170px' }}>
    <Skeleton height="200px" mb={2} borderRadius="md" />
    <SkeletonText mt="2" noOfLines={2} gap="2" />
  </Box>
);

export default BookCardSkeleton;
