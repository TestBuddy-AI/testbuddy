import {parse} from 'jest-editor-support'

test('asdsds - valid path', () => {
  const path = "/Users/camilo.salinas/Documents/Personal/testproject/tests/Form.test.tsx";
  const result = parse(path);
  expect(result).toEqual({
    directory: "/Users/camilo.salinas/Documents/Personal/testproject/tests",
    filename: "Form.test.tsx",
    extension: "tsx"
  });
});

test('ABCDEsasdass - path without extension', () => {
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