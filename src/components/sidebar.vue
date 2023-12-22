<template>
  <aside class="sidebar">
      <div class="group">
        <div class="sidebar-header">
          <h2>Notas</h2>
          <button @click="criarNota">Criar Nota</button>
          <button @click="downloadNota">Download</button> <!-- Botão para download da nota -->
          <button @click="importaNota">importar</button> <!-- Botão para download da nota -->
        </div>
        <ul class="notes-list">
          <li v-for="(nota, index) in notas" :key="index" @click="selecionarNota(nota)">
            {{ nota.title }}
            <button @click="excluirNota(index)">Excluir</button> <!-- Botão para excluir nota -->
          </li>
        </ul>
    </div>
  </aside>
</template>

<script>
export default {
  data () {
    return {
      notas: this.recuperarNotasSalvas() || [], // Recupera notas salvas
      ultimaNotaSelecionada: null
    }
  },
  methods: {
    criarNota (content) {
      let novoConteudo
      let h1Content
      if (content instanceof PointerEvent) {
        // Se content é um objeto PointerEvent
        h1Content = `Nota ${this.notas.length + 1}`
        novoConteudo = `<h1>Nota ${h1Content}</h1><p>Conteúdo da nova nota</p>`
      } else {
        novoConteudo = content
        const match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i)
        h1Content = match ? match[1] : null
      }
      const novaNota = {
        id: Date.now(),
        title: h1Content,
        content: novoConteudo
      }
      this.notas.push(novaNota)
      this.salvarNotas(this.notas, novaNota)
      this.$emit('notaCriada', novaNota)
      this.ultimaNotaSelecionada = novaNota
      localStorage.setItem('lastEditNote', novaNota.id)
    },
    excluirNota (index) {
      if (this.notas.length === 1) {
        this.$emit('notaSelecionada', [])
        this.notas.splice(index, 1)
      } else if (this.notas.length - 1 === index) {
        const nota = this.notas[this.notas.length - 2]
        if (nota) {
          this.$emit('notaSelecionada', nota)
          this.notas.splice(index, 1) // Remove a nota pelo índice
        // Faça algo com a nota encontrada
        }
      } else {
        this.notas.splice(index, 1) // Remove a nota pelo índice
      }

      this.salvarNotas(this.notas) // Salva as notas após a exclusão
    },
    salvarNotas (notas) {
      localStorage.setItem('notas', JSON.stringify(notas)) // Salva as notas no localStorage
    },
    recuperarNotasSalvas () {
      const notasSalvas = localStorage.getItem('notas') // Recupera as notas do localStorage
      return notasSalvas ? JSON.parse(notasSalvas) : null // Retorna as notas recuperadas (ou null se não houver notas)
    },
    selecionarNota (nota) {
      this.$emit('notaSelecionada', nota) // Emitir evento 'notaSelecionada'
      this.ultimaNotaSelecionada = nota
      localStorage.setItem('lastEditNote', this.ultimaNotaSelecionada.id)
    },
    downloadNota () {
      this.$emit('baixaNota')
    },
    importaNota () {
      this.$emit('importaNota')
    }
  }
}
</script>

<style scoped>
/* Estilos para o componente */

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notes-list {
  list-style: none;
  padding: 0;
  cursor: pointer;
}

.notes-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
}

.notes-list li:hover {
  background-color: #e0e0e0;
}

.group{
  padding: 45px;
  min-height: 100vh;
}
</style>
