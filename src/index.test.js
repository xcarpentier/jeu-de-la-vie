import { countAliveNeighbors, getInitialState } from "./index";

const getMockGrid = (param) => {
  let mockGrid = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ];

  if (param) {
    const [indexLine, indexColumn] = param;
    mockGrid[indexLine][indexColumn] = true;
  }

  return mockGrid;
};
describe("countAliveNeighbors", () => {
  describe("normal case", () => {
    const indexColumn = 2;
    const indexLine = 2;
    const baseParam = {
      indexColumn,
      indexLine,
    };
    it("returns 0 when no alive neighbor", () => {
      expect(
        countAliveNeighbors({
          state: getMockGrid(),
          ...baseParam,
        })
      ).toBe(0);
    });

    test.each`
      indexLine | indexColumn | position
      ${1}      | ${1}        | ${"left up"}
      ${1}      | ${2}        | ${"up"}
      ${1}      | ${3}        | ${"up right"}
      ${2}      | ${1}        | ${"left"}
      ${2}      | ${3}        | ${"right"}
      ${3}      | ${1}        | ${"bottom left"}
      ${3}      | ${2}        | ${"bottom"}
      ${3}      | ${3}        | ${"right bottom"}
    `(
      "returns 1 when $position is alive neighbor",
      ({ indexLine, indexColumn }) => {
        let mockLocalGrid = getMockGrid([indexLine, indexColumn]);

        expect(
          countAliveNeighbors({
            state: mockLocalGrid,
            ...baseParam,
          })
        ).toBe(1);
      }
    );
  });

  describe("corner case", () => {
    test.each`
      indexLineMock | indexColumnMock | position          | indexLine | indexColumn
      ${1}          | ${1}            | ${"left up"}      | ${0}      | ${0}
      ${1}          | ${3}            | ${"right up"}     | ${0}      | ${4}
      ${3}          | ${3}            | ${"right bottom"} | ${4}      | ${4}
      ${3}          | ${1}            | ${"left bottom"}  | ${4}      | ${0}
    `(
      "returns 1 when $position is alive neighbor",
      ({ indexLine, indexColumn, indexColumnMock, indexLineMock }) => {
        let mockLocalGrid = getMockGrid([indexLineMock, indexColumnMock]);

        expect(
          countAliveNeighbors({
            state: mockLocalGrid,
            indexLine,
            indexColumn,
          })
        ).toBe(1);
      }
    );
  });

  describe("side case", () => {
    test.each`
      indexLineMock | indexColumnMock | position               | indexLine | indexColumn
      ${1}          | ${2}            | ${"top side"}          | ${0}      | ${2}
      ${2}          | ${3}            | ${"right side"}        | ${2}      | ${4}
      ${3}          | ${2}            | ${"right bottom side"} | ${4}      | ${2}
      ${2}          | ${1}            | ${"left side"}         | ${2}      | ${0}
    `(
      "returns 1 when $position is alive neighbor",
      ({ indexLine, indexColumn, indexColumnMock, indexLineMock }) => {
        let mockLocalGrid = getMockGrid([indexLineMock, indexColumnMock]);

        expect(
          countAliveNeighbors({
            state: mockLocalGrid,
            indexLine,
            indexColumn,
          })
        ).toBe(1);
      }
    );
  });

  describe("getInitialState", () => {
    it("returns initial state", () => {
      const mockGrid = getMockGrid();
      mockGrid[2][1] = true;
      mockGrid[2][2] = true;
      mockGrid[2][3] = true;

      expect(
        getInitialState({
          dimension: {
            width: 100,
            height: 100,
          },
          cellSize: 20,
        })
      ).toEqual(mockGrid);
    });
  });
});
