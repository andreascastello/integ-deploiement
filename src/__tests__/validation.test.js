import { describe, it, expect } from "vitest"
import { isValidName, isValidEmail, isValidPostalCode, isValidAge } from "../utils/validation"

describe("Validation Utils", () => {
    it("isValidName - valid names", () => {
        expect(isValidName("John")).toBe(true)
        expect(isValidName("Élise")).toBe(true)
        expect(isValidName("Jean-Pierre")).toBe(true)
        expect(isValidName("Zoë")).toBe(true)
    })

    it("isValidName - invalid first name", () => {
        expect(isValidName("J0hn")).toBe(false)
        expect(isValidName("!John")).toBe(false)
        expect(isValidName("")).toBe(false)
    })
    it("isValidName - invalid last name", () => {
        expect(isValidName("D0e")).toBe(false)
        expect(isValidName("!Doe")).toBe(false)
        expect(isValidName("")).toBe(false)
    })

    it("isValidEmail - validates email formats", () => {
        expect(isValidEmail("test@example.com")).toBe(true)
        expect(isValidEmail("john.doe@sub.domain.com")).toBe(true)
        expect(isValidEmail("invalid-email")).toBe(false)
        expect(isValidEmail("test@.com")).toBe(false)
    })

    it("isValidPostalCode - validates postal codes", () => {
        expect(isValidPostalCode("10001")).toBe(true)
        expect(isValidPostalCode("ABCDE")).toBe(false)
        expect(isValidPostalCode("1000")).toBe(false)
        expect(isValidPostalCode("100001")).toBe(false)
    })

    it("isValidAge - validates age requirement", () => {
        const eighteenYearsAgo = new Date()
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
        expect(isValidAge(eighteenYearsAgo.toISOString().split("T")[0])).toBe(true)

        const seventeenYearsAgo = new Date()
        seventeenYearsAgo.setFullYear(seventeenYearsAgo.getFullYear() - 17)
        expect(isValidAge(seventeenYearsAgo.toISOString().split("T")[0])).toBe(false)
    })

    it("isValidAge - validates age requirement with birthday not yet passed", () => {
        const eighteenYearsAgo = new Date()
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
        eighteenYearsAgo.setMonth(eighteenYearsAgo.getMonth() + 1) // Set to next month
        expect(isValidAge(eighteenYearsAgo.toISOString().split("T")[0])).toBe(false)
    })

    it("isValidAge - returns false when no birthDate is provided", () => {
        expect(isValidAge("")).toBe(false)
        expect(isValidAge(null)).toBe(false)
        expect(isValidAge(undefined)).toBe(false)
    })
})
