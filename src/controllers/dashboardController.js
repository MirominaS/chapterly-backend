import { getDashboardStatsService, getFormatAnalyticsService, getGenreAnalyticsService, getLanguageAnalyticsService, getRecentBooksService } from "../services/dashboardService.js"

export const getDashboardStatsController = async(req, res) => {
    try {
        const stats = await getDashboardStatsService(req.user.id);

        res.json({
            totalBooks: Number(stats.total_books),
            completedBooks: Number(stats.completed_books),
            ongoingBooks: Number(stats.ongoing_books),
            notStartedBooks: Number(stats.not_started_books),
            pausedBooks: Number(stats.paused_books),
            droppedBooks: Number(stats.dropped_books),
            totalPagesRead: Number(stats.total_pages_read),
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getRecentBooksController = async(req,res) => {
    try {
        const books = await getRecentBooksService(req.user.id)

        const formattedBooks = books.map((book) => {
            const progress = book.total_pages > 0 
                ? Math.round(
                    (book.current_page/book.total_pages)*100
                ) : 0;

        return {...book, progress_percentage:progress,}
        })
        res.json(formattedBooks)
    } catch (error) {
        res.status(500).json({error: error.message,})
    }
    
}

export const getGenreAnalyticsController = async(req,res) => {
    try {
        const genres = await getGenreAnalyticsService(req.user.id);

        const formattedGenres = genres.map((genre) => ({
            genre: genre.genre,
            count: Number(genre.count),
        }))
        res.json(formattedGenres)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getLanguageAnalyticsController = async(req, res) => {
    try {
        const languages = await getLanguageAnalyticsService(req.user.id);

        const formattedLanguages = languages.map((language) =>({
            language: language.language,
            count: Number(language.count),
        }))

        res.json(formattedLanguages)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

