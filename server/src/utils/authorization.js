export const canEditArticle = (user, article) => {
  // ADMIN override
  if (user.role === "ADMIN") return true;

  // EDITOR ownership check
  if (user.role === "EDITOR") {
    return article.author.toString() === user.userId;
  }

  // All others: no access
  return false;
};