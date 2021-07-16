const asyncHandler = require("express-async-handler");
const News = require("../models/newsModel.js");
const User = require("../models/userModel");
const imageToBase64 = require("image-to-base64");
const moment = require("moment");

// @desc    Add News
// @route   POST /api/news/addNews
// @access  Private
const addNews = asyncHandler(async (req, res) => {
  console.log(req);
  // const imgUrl = await uploadImage(req.files)
  const { title, content, url, author, category, imageUrl } = req.body;
  // console.log("req.body", req.body);
  // console.log("req.files.images", req.files.image);
  let urlImage = "";
  if (imageUrl == "")
    urlImage = await imageToBase64(req.files.image.path);

  console.log("urlImage", urlImage);

  const news = await News.create({
    author,
    title,
    content,
    category,
    url,
    urlToImage: imageUrl !== "" ? imageUrl : `data:${req.files.image.type};base64,` + urlImage,
    addedAt: Date.now(),
  });

  if (news) {
    res.status(201).json({
      success: true,
      msg: "Successfully Added News",
      data: news,
    });
  } else {
    res.status(400);
    throw new Error("Invalid News data");
  }

  // console.log(bodyData)
  if (!req.files) {
    res.status(400).send("Select an Image.");
  } else {
  }
});

const getAllNews = asyncHandler(async (req, res) => {
  console.log("page number : " + req.params.page);
  console.log("per page : " + req.params.perPage);
  var size = req.params.perPage;
  var pageNo = req.params.page; // parseInt(req.query.pageNo)

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  let news = await News.find({});

  let result = await News.find({})
    .sort("-addedAt")
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] })
    .sort("-id")
    .limit(Number(query.limit))
    .skip(Number(query.skip));

  // const news = await News.find({}, query).populate({ path: 'category', select: ['_id', 'category_name'] }).populate({ path: 'addedBy', select: ['name', 'email']})
  res.json({
    success: true,
    count: news.length,
    limit: Number(query.limit),
    data: result,
  });
});

const getNewsByUser = asyncHandler(async (req, res) => {
  var size = req.params.perPage;
  var pageNo = req.params.page; // parseInt(req.query.pageNo)

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  let news = await News.find({});

  let result = await News.find({ addedBy: req.user._id })
    .sort("-addedAt")
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] })
    .limit(Number(query.limit))
    .skip(Number(query.skip));

  // const news = await News.find({}, query).populate({ path: 'category', select: ['_id', 'category_name'] }).populate({ path: 'addedBy', select: ['name', 'email']})
  res.json({
    success: true,
    count: news.length,
    limit: Number(query.limit),
    data: result,
  });
  // const news = await News.find({})
  // res.json({
  //     success: true,
  //     data: news
  // })
});

const getNewsId = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.newsId)
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] })
    .populate({ path: "comments.user", select: ["name", "email"] });
  if (news) {
    news.views = news.views + 1;
  }

  await news.save();

  res.json({
    success: true,
    data: news,
  });
  // const news = await News.find({})
  // res.json({
  //     success: true,
  //     data: news
  // })
});

const getNewsByCategory = asyncHandler(async (req, res) => {
  // const news = await News.find({ category: req.params.catId }).populate({ path: 'category', select: ['_id', 'category_name'] }).populate({ path: 'addedBy', select: ['name', 'email'] });

  console.log("page number : " + req.params.page);
  console.log("per page : " + req.params.perPage);
  var size = req.params.perPage;
  var pageNo = req.params.page; // parseInt(req.query.pageNo)

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;

  let news = await News.find({ category: req.params.catId });

  let result = await News.find({ category: req.params.catId })
    .sort("-addedAt")
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] })
    .sort("-id")
    .limit(Number(query.limit))
    .skip(Number(query.skip));

  // const news = await News.find({}, query).populate({ path: 'category', select: ['_id', 'category_name'] }).populate({ path: 'addedBy', select: ['name', 'email']})
  res.json({
    success: true,
    count: news.length,
    limit: Number(query.limit),
    data: result,
  });
});

const editNews = asyncHandler(async (req, res) => {
  let news = await News.findById(req.params.newsId);

  if (!news) {
    return res.status(401).json({
      success: false,
      msg: "News not found.",
    });
  }

  news = await News.findByIdAndUpdate(req.params.newsId, req.body, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json({ success: true, data: news, msg: "Successfully updated" });
});

const sliderNews = asyncHandler(async (req, res) => {
  const news = await News.find({ addToSlider: true })
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] });
  res.status(200).json({ success: true, total: news.length, data: news });
});

const getRelatedNews = asyncHandler(async (req, res) => {
  const news = await News.find({ category: req.params.catId })
    .limit(10)
    .populate({ path: "category", select: ["_id", "category_name"] })
    .populate({ path: "addedBy", select: ["name", "email"] });
  res.status(200).json({ success: true, total: news.length, data: news });
});

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newsId = req.body.newsId;
  const comment = req.body.comment;

  const news = await News.findById(newsId);

  news.comments.push({
    user: userId,
    comment: comment,
  });

  await news.save();

  res
    .status(200)
    .json({ success: true, data: news, msg: "You have added a comment." });
});

const removeComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newsId = req.body.newsId;
  const commentId = req.body.commentId;

  console.log("userId", userId);
  let news = await News.findById(newsId);

  console.log(news.comments);

  let foundNews = news.comments.find((obj) => {
    console.log("obj", obj);
    return obj._id == commentId;
  });

  console.log("foundNews", foundNews);
  if (!foundNews) {
    return res.json({
      success: false,
      msg: "Comment not exits.",
    });
  }

  let newNewsData = news.comments.filter((obj) => {
    // console.log("obj", obj)
    return obj._id != commentId;
  });

  console.log("newNewsData", newNewsData);

  news.comments = newNewsData;

  await news.save();

  res.json({
    success: true,
    data: newNewsData,
    msg: "Successfully removed",
  });
});

const getTodayNews = asyncHandler(async (req, res) => {

  let result = await News.find({
    updatedAt: { $lt: new Date(), 
        $gte: new Date(new Date().setDate(new Date().getDate()-1)) },
  }).sort("-addedAt")
  .populate({ path: 'category', select: ['_id', 'category_name'] }).populate({ path: 'addedBy', select: ['name', 'email']})
  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

module.exports = {
  addNews,
  getAllNews,
  getTodayNews,
  getNewsId,
  getNewsByUser,
  getNewsByCategory,
  editNews,
  sliderNews,
  getRelatedNews,
  addComment,
  removeComment,
};
