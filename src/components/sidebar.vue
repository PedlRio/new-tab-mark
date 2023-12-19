<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Notas</h2>
      <button @click="criarNota">Criar Nota</button>
      <button @click="downloadNota">Download</button> <!-- Botão para download da nota -->
    </div>
    <ul class="notes-list">
      <li v-for="(nota, index) in notas" :key="index" @click="selecionarNota(nota)">
        {{ nota.title }}
        <button @click="excluirNota(index)">Excluir</button> <!-- Botão para excluir nota -->
      </li>
    </ul>
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
    criarNota () {
      const novaNota = {
        id: Date.now(), // Gera um ID único usando timestamp
        title: `Nota ${this.notas.length + 1}`,
        content: `<h1>Nota ${this.notas.length + 1}</h1><p>Conteúdo da nova nota</p>`
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
    }
  }
}
</script>

<style scoped>
/* Estilos para o componente */
.sidebar {
  width: 300px;
  height: 100%;
  position: absolute;
  left: 0;
  background: #575757;
  padding: 20px;
  box-sizing: border-box;
}

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
</style>
