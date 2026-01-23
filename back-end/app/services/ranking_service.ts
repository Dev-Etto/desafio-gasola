import User from '#models/user'
import RankingItemDto from '#dtos/ranking_item.dto'

export default class RankingService {
  async getTopRankings(limit: number = 10): Promise<RankingItemDto[]> {
    const users = await User.query()
      .orderBy('high_score', 'desc')
      .limit(limit)
      .select('username', 'high_score')

    return users.map((user) => RankingItemDto.fromModel(user))
  }
}
