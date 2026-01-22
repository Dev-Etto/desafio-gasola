import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'words'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('word').notNullable()
      table.string('hint').nullable()
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
