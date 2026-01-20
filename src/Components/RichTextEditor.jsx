import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaIndent,
  FaOutdent,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaEraser,
} from "react-icons/fa";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn = (active) =>
    `p-2 rounded-md border transition ${
      active
        ? "bg-green-600 text-white border-green-600"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">
        {/* Text styles */}
        <button className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FaBold />
        </button>

        <button className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FaItalic />
        </button>

        <button className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FaUnderline />
        </button>

        {/* Color picker */}
        <input
          type="color"
          className="h-9 w-9 cursor-pointer border rounded"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />

        <span className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FaListUl />
        </button>

        <button className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FaListOl />
        </button>

        <button className={btn(false)} onClick={() => editor.chain().focus().sinkListItem("listItem").run()}>
          <FaIndent />
        </button>

        <button className={btn(false)} onClick={() => editor.chain().focus().liftListItem("listItem").run()}>
          <FaOutdent />
        </button>

        <span className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button className={btn(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <FaAlignLeft />
        </button>

        <button className={btn(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <FaAlignCenter />
        </button>

        <button className={btn(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <FaAlignRight />
        </button>

        {/* Clear */}
        <button
          className="p-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <FaEraser />
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[450px] p-4 text-sm leading-relaxed focus:outline-none"
      />
    </div>
  );
}
