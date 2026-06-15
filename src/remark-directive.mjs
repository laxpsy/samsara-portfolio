// src/plugins/remark-directives.js
import { visit } from "unist-util-visit";
import { h } from "hastscript";

/**
 * Each handler receives the directive node and returns a hast node (or null to skip).
 * Add new directives here.
 */
const containerDirectives = {
  "image-group": (node) => ({
    type: "element",
    tagName: "div",
    properties: { className: ["image-group"] },
    children: node.children,
  }),
  fullwidth: () => ({
    type: "element",
    tagName: "div",
    properties: {
      className: ["fullwidth-images"],
    },
    children: [],
  }),
};

const leafDirectives = {
  // ::youtube{id="dQw4w9WgXcQ"}
  // "youtube": (node) => ({
  //   type: "element",
  //   tagName: "iframe",
  //   properties: {
  //     src: `https://www.youtube.com/embed/${node.attributes?.id}`,
  //     width: 560,
  //     height: 315,
  //     frameBorder: "0",
  //     allowFullScreen: true,
  //   },
  //   children: [],
  // }),
};

const textDirectives = {
  kimg: (node) => ({
    type: "element",
    tagName: "img",
    properties: {
      src: node.attributes?.src,
      alt: node.children?.[0]?.value ?? "",
      style: "max-width: 100%; height: auto;",
    },
    children: [],
  }),
  // :kbd[Ctrl+K]
  // "kbd": (node) => ({
  //   type: "element",
  //   tagName: "kbd",
  //   properties: {},
  //   children: node.children,
  // }),
};

export function remarkDirectiveHandlers() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "containerDirective") {
        const handler = containerDirectives[node.name];
        if (!handler) return;
        const hast = handler(node);
        node.data = { hName: hast.tagName, hProperties: hast.properties };
      }
    });
  };
}
