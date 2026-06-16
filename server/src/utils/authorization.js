export const canEditArticle = (user, article) => {
  if (user.role === "ADMIN") {
    return true;
  }

  if (user.role === "EDITOR") {
    return article.author.toString() === user.id;
  }

  return false;
};