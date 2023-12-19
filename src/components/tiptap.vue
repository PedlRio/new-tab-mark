<template>
    <editor-content :editor="editor" />
</template>

<script>
import { defineComponent } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-2'
import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import StarterKit from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import FileHandler from '@tiptap-pro/extension-file-handler'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const CustomDocument = Document.extend({
  content: 'heading block*'
})

export default defineComponent({
  components: {
    EditorContent
  },

  data () {
    return {
      editor: null,
      isFirstHeadingEditing: false
    }
  },

  mounted () {
    this.initializeEditor()
    this.loadContent()
  },

  methods: {
    initializeEditor (ids) {
      this.editor = new Editor({
        extensions: [
          CustomDocument,
          StarterKit.configure({
            document: false,
            heading: false
          }),
          Heading.configure({
            HTMLAttributes: {
              class: 'first-heading'
            }
          }),
          Placeholder.configure({
            placeholder: ({ node }) => {
              if (node.type.name === 'heading') {
                return 'What’s the title?'
              }

              return 'Can you add some further context?'
            }
          }),
          Typography,
          Highlight,
          TaskItem,
          TaskList,
          Link,
          Image.configure({
            inline: true,
            allowBase64: true
          }),
          FileHandler.configure({
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            onDrop: (currentEditor, files, pos) => {
              files.forEach(file => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                  currentEditor.chain().insertContentAt(pos, {
                    type: 'image',
                    attrs: {
                      src: fileReader.result
                    }
                  }).focus().run()
                }
              })
            },
            onPaste: (currentEditor, files) => {
              files.forEach(file => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                  currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                    type: 'image',
                    attrs: {
                      src: fileReader.result
                    }
                  }).focus().run()
                }
              })
            }
          })
        ],
        editorProps: {
          attributes: {
            class: 'markdown-body prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
          }
        },
        content: localStorage.getItem('editorContent') || `
          <h1>
            What’s the title?
          </h1>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        `,
        onBlur: () => this.saveContent()
      })
    },

    saveContent () {
      const heading = this.editor.view.dom.querySelector('h1')
      const content = this.editor.getHTML()
      localStorage.setItem('editorContent', content)
      this.$emit('notaAtualizada', content, heading)
    },

    loadContent () {
      const savedContent = localStorage.getItem('editorContent')
      if (savedContent) {
        this.editor.commands.setContent(savedContent)
      }
    },
    loadNoteContent (nota) {
      this.editor.commands.setContent(nota.content)
      localStorage.setItem('editorContent', nota.content)
      console.log(nota.title)
      if (nota.length === 0) {
        localStorage.removeItem('editorContent')
      }
    }
  },

  beforeUnmount () {
    this.editor.destroy()
  }
})
</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }
}

/* Placeholder (at the top) */
/*.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}*/

/* Placeholder (on every new line) */
.tiptap .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

ul[data-type="taskList"] {
  list-style: none;
  padding: 0;

  p {
    margin: 0;
  }

  li {
    display: flex;

    > label {
      flex: 0 0 auto;
      margin-right: 0.5rem;
      user-select: none;
    }

    > div {
      flex: 1 1 auto;
    }

    ul li,
    ol li {
      display: list-item;
    }

    ul[data-type="taskList"] > li {
      display: flex;
    }
  }
}
.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }
  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }
  div#app{
    display: flex;
    align-content: space-between;
    justify-content: center;
  }
  body{
    background-color: #0d1117;
  }
</style>