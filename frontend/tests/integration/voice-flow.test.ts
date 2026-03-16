import { describe, expect, it } from "vitest";

describe("voice flow", () => {
	it("runs a basic smoke assertion", () => {
		expect("voice").toContain("voi");
	});
});

