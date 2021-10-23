


//import function from dev to test environment
jest.mock(t, () => ({
}))


describe('test category', () => {
    test('tests get movie function on bot - year, genre, cast specified', () => {
       getAnyMovie.mockReturnValue('Toy Story 4')
      // expect(otherFn('Tom Hanks', 'Drama','2019')).toBe('Toy Story 4');
      console.log('test');
    })
  })