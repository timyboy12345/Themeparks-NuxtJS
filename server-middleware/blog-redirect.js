module.exports = function (req, res, next) {
  const isArticleNotFound = req.url.includes('non-existing-translation')

  if (isArticleNotFound) {
    res.writeHead(307, { Location: req.url.replace('non-existing-translation', '') })
    res.end()
  } else {
    next()
  }
}
