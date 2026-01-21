import User from '#models/user'

export default class RankingService {
  async getTopRankings(limit: number = 10) {
    return await User.query()
      .orderBy('high_score', 'desc')
      .limit(limit)
      .select('username', 'high_score')
  }
}
