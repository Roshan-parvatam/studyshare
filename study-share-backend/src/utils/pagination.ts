export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationParams = (
  page: string | undefined,
  limit: string | undefined,
  maxLimit: number = 50
): PaginationParams => {
  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit || '10', 10)));
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

