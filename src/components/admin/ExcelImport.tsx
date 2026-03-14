'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { FileUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { MovieFormData } from '@/lib/types'

interface ExcelImportProps {
  onImport: (data: MovieFormData[]) => Promise<void>
  type: 'movie' | 'series'
}

export function ExcelImport({ onImport, type }: ExcelImportProps) {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setError(null)
    setSuccess(null)

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        if (jsonData.length === 0) {
          throw new Error('The Excel file is empty.')
        }

        const formattedData: MovieFormData[] = jsonData.map((row) => ({
          title: String(row.title || ''),
          description: String(row.description || ''),
          poster_url: String(row.poster_url || ''),
          trailer_url: String(row.trailer_url || ''),
          telegram_link: String(row.telegram_link || ''),
          genre: row.genre ? String(row.genre).split(',').map((g: string) => g.trim()) : [],
          release_year: Number(row.release_year) || new Date().getFullYear(),
          rating: Number(row.rating) || 0,
          type: type,
        }))

        // Basic validation
        const invalidRows = formattedData.filter(m => !m.title)
        if (invalidRows.length > 0) {
          throw new Error('Some rows are missing the title.')
        }

        await onImport(formattedData)
        setSuccess(`Successfully imported ${formattedData.length} ${type === 'movie' ? 'movies' : 'series'}.`)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } catch (err: any) {
        console.error('Import error:', err)
        setError(err.message || 'Failed to import data. Please check the file format.')
      } finally {
        setImporting(false)
      }
    }
    reader.onerror = () => {
      setError('Failed to read the file.')
      setImporting(false)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
          disabled={importing}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="border-white/10 bg-[#12121a] text-zinc-300 hover:bg-white/5 h-9 px-4 rounded-xl gap-2"
        >
          {importing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileUp className="w-4 h-4" />
          )}
          Import Excel
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {success}
        </div>
      )}
    </div>
  )
}
