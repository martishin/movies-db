export default class Genre {
  id: number
  genre: string
  checked: boolean

  constructor(id: number, genre: string, checked: boolean) {
    this.id = id
    this.genre = genre
    this.checked = checked
  }
}
