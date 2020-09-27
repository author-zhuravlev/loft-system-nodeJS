module.exports = User => User.aggregate([
  { $project: {
      _id: 0,
      id: "$_id",
      password: 1,
      firstName: 1,
      middleName: 1,
      permission: 1,
      surName: 1,
      username: 1,
      image: 1,
      accessToken: 1,
      refreshToken: 1,
      accessTokenExpiredAt: 1,
      refreshTokenExpiredAt: 1
    }}
])
