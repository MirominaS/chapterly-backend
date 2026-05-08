import { getDashboardStatsService } from "../services/dashboardService.js"

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