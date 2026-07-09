'use client'

import { Suspense } from 'react'

function DateRangePickerContent() {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="date"
        name="from"
        className="border rounded px-3 py-1.5 text-sm"
        defaultValue={new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]}
      />
      <span className="text-gray-400">s/d</span>
      <input
        type="date"
        name="to"
        className="border rounded px-3 py-1.5 text-sm"
        defaultValue={new Date().toISOString().split('T')[0]}
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
        Terapkan
      </button>
    </div>
  )
}

export default function DateRangePicker() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DateRangePickerContent />
    </Suspense>
  )
}
