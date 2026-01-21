import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.updateOrCreateMany('name', [
      { name: 'Back-end' },
      { name: 'Front-end' },
      { name: 'Mobile' },
      { name: 'Banco de Dados' },
      { name: 'DevOps' },
      { name: 'QA' },
    ])
  }
}
