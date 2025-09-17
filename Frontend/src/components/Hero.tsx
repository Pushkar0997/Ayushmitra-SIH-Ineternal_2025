"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Streamline Your Hospital Experience with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get preliminary health insights, manage your records, and connect with government health schemes, all in one
            place. Experience the future of healthcare management.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Quick Symptom Triage
          </Button>
        </div>
      </div>
    </section>
  )
}
