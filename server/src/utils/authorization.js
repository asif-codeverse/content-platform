export const canEditArticle = (user, article) => {

  if (user.role === "ADMIN") {
    return true;
  }

  return article.author.toString() === user.id;

};