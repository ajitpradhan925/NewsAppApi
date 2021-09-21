const express = require('express');
const router = express.Router()
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToFav,
  getFavorites,
  removeFavorite,
  resetPassword,
  checkFavExistsOrNot
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware.js')

router.route('/').post(registerUser).get(protect, getUsers)
router.route('/login').post(authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
//   .delete(protect, deleteUser)
  .get(getUserById)
//   .put(protect, updateUser)

router.route('/profile/password/reset').post(protect ,resetPassword);

router.route('/addToFav/:newsId').put(protect, addToFav)
router.route('/getFavOfUser/all').get(protect, getFavorites)

router.route('/checkExists/fav/:newsId').get(protect, checkFavExistsOrNot)

module.exports = router