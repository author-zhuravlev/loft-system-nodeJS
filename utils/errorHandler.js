module.exports = (res, err) => {
  console.log(err)
  res.status(500).json({
    success: false,
    message: err.message || err || `Сервер временно не работает из-за нападения НЛО! Мы делаем всё возможное, чтобы восстановить соединение`
  })
}
