import { getAnyMovie } from './index.js'

//import function from dev to test environment
jest.mock('./myModule.js', () => ({
  ...(jest.requireActual('./index.js')),
  getAnyMovie: jest.fn()
}))


describe('test category', () => {
    it('tests get movie function on bot - year, genre, cast specified', () => {
      getAnyMovie.mockReturnValue('foo')
      expect(otherFn("Drama, 2019, Tom Hanks")).toBe('foo')
    })
  })
