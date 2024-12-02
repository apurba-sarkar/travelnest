const APIFeatures = require("./../utils/apiFeatures");
const Travel = require("../models/travelModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not and Image! please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTravelImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

exports.resizeTravelImages = catchAsync(async (req, res, next) => {
  console.log(req.files);

  if (!req.files.imageCover || !req.files.images) return next();

  // *process cover image

  req.body.imageCover = `travel-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/image/travels/${req.body.imageCover}`);

  // travel contain images || others
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `travel-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/image/travels/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

// exports.checkID = (req, res, next, val) => {
//   console.log("id is : ", val);

//   if (req.params.id * 1 > Travel.length) {
//     return res.status(404).json({
//       status: fail,
//       message: "Invalid Id",
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   console.log("id is : ", val);

//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: fail,
//       message: "missing name or price",
//     });
//   }
// };
exports.aliasTopTravel = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// exports.getAllTravel = async (req, res, next) => {
//   try {
//     const features = new APIFeatures(Travel.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const travels = await features.query;

//     // const travels = await query;
//     res.status(200).json({
//       status: "success",
//       requestedAt: req.requestTime,
//       results: travels.length,
//       data: travels,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// exports.getTravel = catchAsync(async (req, res, next) => {
//   const travels = await Travel.findById(req.params.id).populate("reviews");

//   console.log("---------------", travels);
//   if (!travels) {
//     return next(new AppError("no tour found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     requestedAt: req.requestTime,
//     results: Travel.length,
//     data: travels,
//   });
// });

// exports.createTravel = catchAsync(async (req, res, next) => {
//   const newTravel = await Travel.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       travel: newTravel,
//     },
//   });

// });

exports.createTravel = factory.createOne(Travel);
exports.getTravel = factory.getOne(Travel, { path: "reviews" });
exports.getAllTravel = factory.getAll(Travel);
exports.updateTravel = factory.updateOne(Travel);
exports.deleteTravel = factory.deleteOne(Travel);

// exports.updateTravel = catchAsync(async (req, res) => {
//   const travel = await Travel.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!travel) {
//     return next(new AppError("no tour found", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: "<Updated Travel>",
//     updatedData: travel,
//   });
// });

// exports.deleteTravel = catchAsync(async (req, res, next) => {
//   const travel = await Travel.findByIdAndDelete(req.params.id);
//   if (!travel) {
//     return next(new AppError("no tour found", 404));
//   }
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

exports.getTravelStats = catchAsync(async (req, res) => {
  const stats = await Travel.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }, // Using the correct field name
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, // Grouping all documents together
        numTravels: { $sum: 1 },
        numRating: { $sum: "$ratingAverage" }, // Using the correct field name
        avgRating: { $avg: "$ratingAverage" }, // Using the correct field name
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Travel.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startDates" },
        numTravelStats: { $sum: 1 },
        travels: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTravelStats: -1 },
    },
    // {
    //   $limit:1
    // }
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

exports.getTravelWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng)
    next(
      new AppError(
        "Please prove latitte and longitude in the format of kat,lng",
        400
      )
    );
  const travels = await Travel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: travels.length,
    data: {
      data: travels,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001; //!conversion for mile and metre

  if (!lat || !lng)
    next(
      new AppError(
        "Please prove latitte and longitude in the format of kat,lng",
        400
      )
    );
  const distances = await Travel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    results: distances.length,
    data: {
      data: distances,
    },
  });
});
