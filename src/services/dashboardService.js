import Book from "../models/Book.js";

// stats
export const getDashboardStatsService = async (user_id) => {
  const books = await Book.find({ user_id });

  return {
    total_books: books.length,
    completed_books: books.filter(
      (b) => b.status === "Completed"
    ).length,

    ongoing_books: books.filter(
      (b) => b.status === "Ongoing"
    ).length,

    not_started_books: books.filter(
      (b) => b.status === "Not Started"
    ).length,

    paused_books: books.filter(
      (b) => b.status === "Paused"
    ).length,

    dropped_books: books.filter(
      (b) => b.status === "Dropped"
    ).length,

    total_pages_read: books.reduce(
      (sum, book) => sum + (book.current_page || 0),
      0
    ),
  };
};

// recent books
export const getRecentBooksService = async (user_id) => {
  return await Book.find(
    { user_id },
    {
      title: 1,
      author: 1,
      status: 1,
      current_page: 1,
      total_pages: 1,
      updatedAt: 1,
    }
  )
    .sort({ updatedAt: -1 })
    .limit(5);
};

// genre analytics
export const getGenreAnalyticsService = async (
  user_id
) => {
  return await Book.aggregate([
    {
      $match: {
        user_id,
        genre: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// language analytics
export const getLanguageAnalyticsService = async (
  user_id
) => {
  return await Book.aggregate([
    {
      $match: {
        user_id,
        language: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$language",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// format analytics
export const getFormatAnalyticsService = async (
  user_id
) => {
  return await Book.aggregate([
    {
      $match: {
        user_id,
        format: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$format",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// monthly completed
export const getMonthlyCompletedService = async (
  user_id
) => {
  return await Book.aggregate([
    {
      $match: {
        user_id,
        status: "Completed",
        finished_date: { $ne: null },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$finished_date",
          },
        },
        completed: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);
};

// dashboardService.js

export const getCurrentlyReadingService =
  async (user_id) => {
    return await Book.find(
      {
        user_id,
        status: "Ongoing",
      },
      {
        title: 1,
        author: 1,
        current_page: 1,
        total_pages: 1,
        cover_image: 1,
      }
    )
      .sort({
        updatedAt: -1,
      })
      .limit(4);
  };