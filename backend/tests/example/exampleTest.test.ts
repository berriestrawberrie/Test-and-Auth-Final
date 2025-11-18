const exampleTestFunction = (number: number): number => {
  return number * 2;
};
describe("This is an example test.", () => {
  test("Should multiply a number by 2 but this should fail.", () => {
    expect(exampleTestFunction(2)).toBe(3);
  });
  test("Should multiply a number by 2", () => {
    expect(exampleTestFunction(2)).toBe(4);
  });
});

//test file for CI
