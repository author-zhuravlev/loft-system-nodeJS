module.exports = News => News.aggregate([
    { $project: {
        _id: 0,
        id: "$_id",
        created_at: 1,
        title: 1,
        user: 1
      }}
])
