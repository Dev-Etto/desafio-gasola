import User from '#models/user'

export default class RankingItemDto {
  constructor(
    public username: string,
    public highScore: number
  ) {}

  static fromModel(user: User): RankingItemDto {
    return new RankingItemDto(user.username, user.highScore || 0)
  }
}
