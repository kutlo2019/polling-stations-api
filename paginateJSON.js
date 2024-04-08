function paginateJSON(req, data) {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const pageSize = parseInt(req.query.pageSize) || 20; // Default page size is 10 if not specified

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
    totalItems: data.length,
    data: paginatedData
  }
}

module.exports = paginateJSON;