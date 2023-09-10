it('should bulk add initial notes', () => {
  const initialNotes = ['note1', 'note2', 'note3'];
  const notes = new Notes();
  notes.bulkAdd(initialNotes);
  expect(notes.getAll()).toEqual(initialNotes);
});

it('should bulk add empty array of initial notes', () => {
  const initialNotes = [];
  const notes = new Notes();
  notes.bulkAdd(initialNotes);
  expect(notes.getAll()).toEqual(initialNotes);
}); 
describe('unit tests', () => {
  it('should return true for truthy values', () => {
    expect(Boolean(true)).toBe(true);
    expect(Boolean(1)).toBe(true);
    expect(Boolean('hello')).toBe(true);
    expect(Boolean([])).toBe(true);
    expect(Boolean({})).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(Boolean(false)).toBe(false);
    expect(Boolean(0)).toBe(false);
    expect(Boolean('')).toBe(false);
    expect(Boolean(null)).toBe(false);
    expect(Boolean(undefined)).toBe(false);
    expect(Boolean(NaN)).toBe(false);
  });
});
 
describe('unit tests', () => {
  it('should return true for truthy values', () => {
    expect(Boolean(true)).toBe(true);
    expect(Boolean(1)).toBe(true);
    expect(Boolean('hello')).toBe(true);
    expect(Boolean([])).toBe(true);
    expect(Boolean({})).toBe(true);
  });

  it('should return false for falsy values', () => {
    expect(Boolean(false)).toBe(false);
    expect(Boolean(0)).toBe(false);
    expect(Boolean('')).toBe(false);
    expect(Boolean(null)).toBe(false);
    expect(Boolean(undefined)).toBe(false);
    expect(Boolean(NaN)).toBe(false);
  });
});
