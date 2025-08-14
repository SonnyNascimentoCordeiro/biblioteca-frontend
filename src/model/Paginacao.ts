export class Paginacao {
   paginaAtual: number = 0
   totalPaginas: number = 0
   registrosCarregados: number = 0
   totalRegistros: number = 0
   ultima: boolean = true

   constructor(paginaAtual?: number, totalPaginas?: number, registrosCarregados?: number, totalRegistros?: number, ultima?: boolean) {
      this.paginaAtual = paginaAtual ?? 0
      this.totalPaginas = totalPaginas ?? 0
      this.registrosCarregados = registrosCarregados ?? 0
      this.totalRegistros = totalRegistros ?? 0
      this.ultima = ultima ?? true
   }

   scrollPosition: number = 0

   public scrollTo(target: number) {
      this.scrollPosition = target
   }
}
