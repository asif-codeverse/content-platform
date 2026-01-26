export const parseQuery = (query) => {
  const rawPage = Number(query.page);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const rawLimit = Number(query.limit);
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 15) : 10;
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
