test('parse - valid path', () => {
  const path = "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form.test.tsx";
  const result = parse(path);
  expect(result).toEqual({
    directory: "/Users/camilo.salinas/Documents/Personal/testproject/tests",
    filename: "Form.test.tsx",
    extension: "tsx"
  });
});

test('parse - path without extension', () => {
  const path = "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form";
  const result = parse(path);
  expect(result).toEqual({
    directory: "/Users/camilo.salinas/Documents/Personal/testproject/tests",
    filename: "Form",
    extension: ""
  });
});

test('parse - path without directory', () => {
  const path = "Form.test.tsx";
  const result = parse(path);
  expect(result).toEqual({
    directory: "",
    filename: "Form.test.tsx",
    extension: "tsx"
  });
});

test('parse - empty path', () => {
  const path = "";
  const result = parse(path);
  expect(result).toEqual({
    directory: "",
    filename: "",
    extension: ""
  });
});