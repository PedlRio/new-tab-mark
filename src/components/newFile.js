import { defineComponent } from 'vue';
import { Editor } from '@tiptap/vue-2';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import FileHandler from '@tiptap-pro/extension-file-handler';
import Image from '@tiptap/extension-image';

export default defineComponent({
components: {
EditorContent
},

data() {
return {
editor: null
};
},

mounted() {
this.editor = new Editor({
extensions: [
Document,
Heading,
Paragraph,
Text,
StarterKit,
Typography,
Highlight,
TaskItem,
TaskList,
Image,
FileHandler.configure({
allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
onDrop: (currentEditor, files, pos) => {
files.forEach(file => {
const fileReader = new FileReader();

fileReader.readAsDataURL(file);
fileReader.onload = () => {
currentEditor.chain().insertContentAt(pos, {
type: 'image',
attrs: {
src: fileReader.result
}
}).focus().run();
};
});
},
onPaste: (currentEditor, files) => {
files.forEach(file => {
const fileReader = new FileReader();

fileReader.readAsDataURL(file);
fileReader.onload = () => {
currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
type: 'image',
attrs: {
src: fileReader.result
}
}).focus().run();
};
});
}
})
],
content: `
        <h1>
          Try to paste or drop files into this editor
        </h1>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      `
});
},

Editor, : .addEventListener('blur', function () {
chrome.storage.local.set({ 'notes': textarea.value });
}),

beforeUnmount() {
this.editor.destroy();
}
});
