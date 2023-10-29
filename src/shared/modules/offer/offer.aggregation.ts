export const commentsPipeline = [
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$offerId', '$offerId'] } } },
        { $project: { _id: 0, rating: 1 } },
      ],
      as: 'comments',
    },
  },
];

export const cityPipeline = [
  {
    $lookup: {
      from: 'cities',
      let: { cityId: '$cityId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$cityId', '$_id'] } } },
        {
          $project: { _id: 0, id: { $toString: '$_id' }, name: 1, location: 1 },
        },
      ],
      as: 'cities',
    },
  },
  {
    $addFields: {
      city: {
        $arrayElemAt: ['$cities', 0],
      },
    },
  },
  {
    $unset: ['cities'],
  },
];

export const authorPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

export const getUserPipeline = (userId: string) => [
  {
    $lookup: {
      from: 'users',
      let: { userId: { $toObjectId: userId } },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
        { $project: { _id: 0, favorites: 1 } },
      ],
      as: 'users',
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

export const finalPipeline = [
  {
    $project: {
      _id: 0,
      id: { $toString: '$_id' },
      author: 1,
      city: 1,
      commentAmount: { $size: '$comments' },
      rating: { $ifNull: [{ $avg: '$comments.rating' }, 0] },
      isFavorite: { $in: ['$_id', { $ifNull: ['$user.favorites', []] }] },
      postDate: 1,
      isPremium: 1,
      imagePreview: 1,
      price: 1,
      title: 1,
      description: 1,
      location: 1,
      images: 1,
      amenities: 1,
      housingType: 1,
      roomAmount: 1,
      guestAmount: 1,
    },
  },
];

export const getPipeline = (userId?: string) => {
  const userPipeline = userId ? getUserPipeline(userId) : [];

  return [
    ...commentsPipeline,
    ...authorPipeline,
    ...userPipeline,
    ...cityPipeline,
    ...finalPipeline,
  ];
};
