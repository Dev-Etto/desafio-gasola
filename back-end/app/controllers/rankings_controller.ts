import type { HttpContext } from '@adonisjs/core/http'

import RankingService from '#services/ranking_service'

export default class RankingsController {
  async index({ response }: HttpContext) {
    const service = new RankingService()
    const rankings = await service.getTopRankings()

    return response.json(rankings)
  }
}
