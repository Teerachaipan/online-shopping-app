export class ErrAlreadyExists extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'this resource already exists'
  }
}
