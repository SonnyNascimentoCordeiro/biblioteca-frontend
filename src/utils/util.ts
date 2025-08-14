import {date} from "quasar";

export function retornaDataHoraAtual(): string {
  const hoje = Date.now()
  return date.formatDate(hoje, 'DD/MM/YYYY HH:mm:ss')
}
