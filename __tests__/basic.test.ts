import { exportToCSV, parseCSV } from "@/lib/csv";

describe("CSV utilities", () => {
  it("exports to CSV by triggering a file download", () => {
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const data = [{ name: "John", email: "john@test.com" }];
    exportToCSV(data, "test");

    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it("does nothing for an empty dataset", () => {
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    exportToCSV([], "empty");

    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("parses CSV correctly", () => {
    const csv = "name,email\nJohn,john@test.com";
    const rows = parseCSV(csv);
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("John");
  });
});
