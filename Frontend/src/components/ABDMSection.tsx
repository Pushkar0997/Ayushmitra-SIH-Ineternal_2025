"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle } from "lucide-react"

// Contract
// - Renders a card section where users can enter a 14-digit ABDM number
// - Only digits allowed; formatted as XXXX XXXX XXXX XX while typing
// - Shows validity state and enables submit only when 14 digits are present
// - Placeholder shows a sample number for display only

export default function ABDMSection() {
  const [rawValue, setRawValue] = useState("") // digits only
  const [submitted, setSubmitted] = useState(false)

  const digitsOnly = (v: string) => v.replace(/\D/g, "")
  const formatABDM = (digits: string) => {
    const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12), digits.slice(12, 14)].filter(Boolean)
    return parts.join(" ")
  }

  const handleChange = (val: string) => {
    const digits = digitsOnly(val).slice(0, 14)
    setRawValue(digits)
    if (submitted) setSubmitted(false)
  }

  const isValid = rawValue.length === 14
  const displayValue = formatABDM(rawValue)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) return
    // Replace with your submission logic (API call, navigation, etc.)
    console.log("ABDM submitted:", rawValue)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Link your ABDM Number</CardTitle>
            <CardDescription>
              Enter your 14-digit ABDM number to continue. This is for demonstration only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="abdm" className="block text-sm font-medium text-gray-700 mb-1">
                  ABDM Number
                </label>
                <Input
                  id="abdm"
                  inputMode="numeric"
                  pattern="\\d*"
                  placeholder="1234 5678 9012 34"
                  value={displayValue}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={!isValid && submitted}
                  aria-describedby="abdm-help"
                />
                <p id="abdm-help" className="mt-2 text-xs text-gray-500">
                  Please enter exactly 14 digits. Only numbers are accepted.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!isValid}>
                  Continue
                </Button>
                {isValid ? (
                  <span className="inline-flex items-center text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Looks good
                  </span>
                ) : (
                  submitted && (
                    <span className="inline-flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" /> Enter a valid 14-digit number
                    </span>
                  )
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
