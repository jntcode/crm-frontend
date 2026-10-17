import "@testing-library/jest-dom";

// jsdom does not implement object URLs; the CSV export helper uses them.
if (typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = jest.fn(() => "blob:mock") as unknown as typeof URL.createObjectURL;
}
if (typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = jest.fn() as unknown as typeof URL.revokeObjectURL;
}
