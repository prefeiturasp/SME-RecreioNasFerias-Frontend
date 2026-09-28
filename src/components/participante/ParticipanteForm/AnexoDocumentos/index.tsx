import { Upload } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { LIMITE_ANEXO_BYTES } from '../constantes'
import { ItemAnexo } from './ItemAnexo'

import { FieldLabel } from '@/components/ui/field'

export function AnexoDocumentos() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [arquivos, setArquivos] = useState<File[]>([])
  const [erro, setErro] = useState('')

  function incluir(lista: FileList | null) {
    if (!lista?.length) return

    const aceitos: File[] = []
    let rejeitado = false

    for (const arquivo of lista) {
      if (arquivo.size > LIMITE_ANEXO_BYTES) {
        rejeitado = true
        continue
      }

      aceitos.push(arquivo)
    }

    setErro(rejeitado ? 'O arquivo deve ter até 10MB.' : '')
    if (aceitos.length) setArquivos((atuais) => [...atuais, ...aceitos])
  }

  function aoSoltar(evento: DragEvent<HTMLButtonElement>) {
    evento.preventDefault()
    incluir(evento.dataTransfer.files)
  }

  function remover(indice: number) {
    setArquivos((atuais) => atuais.filter((_, atual) => atual !== indice))
  }

  return (
    <div>
      <FieldLabel htmlFor="anexo-documentos" className="font-bold">
        Anexo de documentos
      </FieldLabel>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(evento) => evento.preventDefault()}
        onDrop={aoSoltar}
        className="mt-2 flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-gray-300 bg-background px-4 py-6 text-center"
      >
        <Upload className="size-6 text-brand-dark" aria-hidden="true" />
        <span className="text-sm text-foreground">
          Clique ou arraste para fazer o upload dos arquivos
        </span>
        <span className="text-sm text-muted-foreground">
          Tamanho do arquivo até 10MB
        </span>
      </button>
      <input
        ref={inputRef}
        id="anexo-documentos"
        type="file"
        multiple
        className="sr-only"
        onChange={(evento) => {
          incluir(evento.target.files)
          evento.target.value = ''
        }}
      />
      {erro ? <p className="mt-2 text-sm text-destructive">{erro}</p> : null}
      {arquivos.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {arquivos.map((arquivo, indice) => (
            <ItemAnexo
              key={`${arquivo.name}-${arquivo.size}-${arquivo.lastModified}`}
              nome={arquivo.name}
              onRemover={() => remover(indice)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
