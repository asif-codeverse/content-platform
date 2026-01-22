export const parseQuery = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 15);
  const skip = (page - 1) * limit;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sort = sortMap[query.sort] || sortMap.newest;
  const filters = {};
  if (query.status) filters.status = query.status;

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
    ];
  }
  return { page, limit, skip, sort, filters };
};
