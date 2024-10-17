const APIFeatures = require("./../utils/apiFeatures");
const Travel = require("../models/travelModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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

exports.getAllTravel = async (req, res) => {
  try {
    const features = new APIFeatures(Travel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const travels = await features.query;

    // const travels = await query;
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: travels.length,
      data: travels,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTravel = catchAsync(async (req, res,next) => {
  const travels = await Travel.findById(req.params.id);
  
  console.log("---------------",travels)
  if (!travels) {
    return next(new AppError("no tour found", 404));
  }
  
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: Travel.length,
    data: travels,
  });
});

exports.createTravel = catchAsync(async (req, res, next) => {
  const newTravel = await Travel.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      travel: newTravel,
    },
  });
  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: err,
  //   });
  // }
});

exports.updateTravel = catchAsync(async (req, res) => {
  const travel = await Travel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: "<Updated Travel>",
    updatedData: travel,
  });
});

exports.deleteTravel = catchAsync(async (req, res) => {
  await Travel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

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
