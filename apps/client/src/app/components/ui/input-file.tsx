'use client'

import FileIcon from '@components/atoms/file-icon'
import { CloudUpload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, ComponentProps, DragEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Label } from './label'

type InputFileProps = {
  onFilesSelected: (files: File[]) => void
  showFiles?: boolean
  errorMessage?: string
  label?: string
} & Omit<ComponentProps<'input'>, 'name' | 'type'>

const InputFile = ({
  onFilesSelected,
  errorMessage,
  label,
  showFiles = false,
  ...props
}: InputFileProps) => {
  const t = useTranslations()
  const [files, setFiles] = useState<File[]>([])
  const ref = useRef<HTMLInputElement>(null)
  const forbiddenExtensions = [
    'exe',
    'bat',
    'sh',
    'msi',
    'cmd',
    'scr',
    'jar',
    'com',
    'vbs',
    'vb',
    'ps1',
    'wsf',
  ]

  const isForbidden = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return forbiddenExtensions.includes(ext!)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: FileList | null = event.target.files
    if (ref.current) {
      ref.current.value = ''
    }
    const safeFiles: File[] = []
    if (selectedFiles) {
      for (const file of selectedFiles) {
        if (isForbidden(file.name)) {
          toast.error(`Le fichier ${file.name} ne peut etre importé.`)
        } else {
          safeFiles.push(file)
        }
      }
      onFilesSelected([...files, ...safeFiles])
      setFiles((prev) => [...prev, ...safeFiles])
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer?.files
    if (droppedFiles && droppedFiles.length > 0) {
      onFilesSelected(Array.from(droppedFiles))
    }
  }

  const handleDelete = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
    onFilesSelected(files)
  }

  return (
    <section className={props.className}>
      <div
        className={`document-uploader`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className="border-dashed border-2 p-4 rounded-lg border-orange-500/50 bg-orange-50 text-sm text-center w-full">
            <p>{label ? label : t('common.dropFile')}</p>
            <Label
              htmlFor="browse"
              className="flex flew-row justify-center mt-2"
            >
              <CloudUpload className="hover:text-primary" />
            </Label>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center">
                {errorMessage}
              </p>
            )}
          </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            accept={props.accept}
            multiple={props.multiple}
            value={undefined}
            ref={ref}
          />
        </>
      </div>
      {showFiles && files.length > 0 && (
        <div className="flex flex-row items-center gap-3 mt-3 w-full py-2 overflow-x-auto">
          {files.map((f, index) => (
            <FileIcon file={f} key={index} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  )
}

export default InputFile
