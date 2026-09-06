import { exportToCSV, parseCSV } from "@/lib/csv";

describe("CSV utilities", () => {
  it("exports to CSV correctly", () => {
    const data = [{ name: "John", email: "john@test.com" }];
    const csv = exportToCSV(data, "test");
    expect(typeof csv).toBe("string");
  });

  it("parses CSV correctly", () => {
    const csv = "name,email\nJohn,john@test.com";
    const rows = parseCSV(csv);
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe("John");
  });
});
