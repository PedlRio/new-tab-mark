<template>
  <div id="app">
    <SidebarMenu ref="Sidebar" @importaNota="openLocalFile" @baixaNota="download" @notaSelecionada="carregarNotaTiptap" @notaCriada="criarEditorTiptap" /> <!-- Adiciona manipulador para o evento notaCriada -->
    <Tiptap ref="tiptapEditor" @notaAtualizada="AtualziaNotaTiptap"/>
  </div>
</template>

<script>
import Tiptap from '../components/tiptap.vue'
import SidebarMenu from '../components/sidebar.vue'
import '../../node_modules/github-markdown-css/github-markdown.css'

export default {
  name: 'App',
  components: {
    SidebarMenu,
    Tiptap
  },
  methods: {
    criarEditorTiptap (novaNota) {
      console.log(novaNota.id)
      // Aqui você pode criar um novo editor Tiptap usando uma referência ao componente Tiptap
      // Vou mostrar um exemplo básico aqui, você pode ajustá-lo conforme necessário
      this.$refs.tiptapEditor.editor.destroy() // Destruir editor existente (se houver)
      this.$refs.tiptapEditor.initializeEditor(novaNota.id) // Inicializar novo editor
      this.$refs.tiptapEditor.loadNoteContent(novaNota)
    },
    carregarNotaTiptap (nota) {
      this.$refs.tiptapEditor.loadNoteContent(nota)
    },
    AtualziaNotaTiptap (content, heading) {
      const ultimaNotaSelecionadaaaa = Number(localStorage.getItem('lastEditNote'))
      const notas = JSON.parse(localStorage.getItem('notas')) || []
      const notaEncontrada = notas.find(nota => nota.id === ultimaNotaSelecionadaaaa)
      notaEncontrada.content = content
      notaEncontrada.title = heading.innerText
      // Salvar a nota atualizada no localStorage ou realizar outras ações, se necessário
      this.salvarNotaAtualizada(notaEncontrada)
    },
    salvarNotaAtualizada (nota) {
      const notas = this.$refs.Sidebar.notas
      const index = notas.findIndex(n => n.id === nota.id)
      if (index !== -1) {
        notas.splice(index, 1, nota) // Substitui a nota na lista de notas pelo índice
        localStorage.setItem('notas', JSON.stringify(notas)) // Salva a lista atualizada no localStorage
      }
    },
    download () {
      const textoParaDownload = this.$refs.tiptapEditor.editor.getHTML() // Substitua isso pelo conteúdo da nota que deseja baixar
      const textoTit = this.$refs.tiptapEditor.editor.view.dom.querySelector('h1').innerText
      const nomeDoArquivo = `${textoTit}.html` // Nome do arquivo com extensão .txt

      const element = document.createElement('a')
      const file = new Blob([textoParaDownload], { type: 'text/html' })
      element.href = URL.createObjectURL(file)
      element.download = nomeDoArquivo
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    openLocalFile () {
      const input = document.createElement('input')
      input.type = 'file'

      input.onchange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()

        reader.onload = (fileEvent) => {
          const content = fileEvent.target.result
          console.log(content) // Aqui você terá o conteúdo do arquivo
          this.$refs.Sidebar.criarNota(content)

          // Faça o que for necessário com o conteúdo do arquivo
        }

        reader.readAsText(file)
      }

      input.click()
    }
  }
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // A aba foi ativada novamente
    // Execute ações que você deseja realizar quando a aba é ativada
    console.log('A aba foi ativada novamente')
    // Por exemplo, recarregue a página do seu plugin
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  }
})
</script>
