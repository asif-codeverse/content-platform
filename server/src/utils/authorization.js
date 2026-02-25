export const canEditArticle = (user,article)=>{
    // admin can edit anything
    if(user.role === 'admin') return true ;

    // editor can edit only article
    if(user.role === 'EDITOR'){
        return article.author.toString() === user.id ;
    }

    // All other : no access
    return false ;
}