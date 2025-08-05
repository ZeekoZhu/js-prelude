(function () {
  'use strict';

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function isEditableElement(
    element: Element,
  ): element is HTMLInputElement | HTMLTextAreaElement | HTMLElement {
    return (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      (element instanceof HTMLElement && element.isContentEditable)
    );
  }

  function getSelectedText(element: Element): string | null {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      if (start !== null && end !== null && start !== end) {
        return element.value.substring(start, end);
      }
    } else if (element instanceof HTMLElement && element.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (element.contains(range.commonAncestorContainer)) {
          return range.toString();
        }
      }
    }
    return null;
  }

  function replaceSelectedText(element: Element, newText: string): void {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      if (start !== null && end !== null) {
        const value = element.value;
        element.value =
          value.substring(0, start) + newText + value.substring(end);
        element.setSelectionRange(start, start + newText.length);
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (element instanceof HTMLElement && element.isContentEditable) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  function initializeScript() {
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('Slugify Selected Text', () => {
        const activeElement = document.activeElement;
        if (activeElement && isEditableElement(activeElement)) {
          const selectedText = getSelectedText(activeElement);
          if (selectedText) {
            const slugified = slugify(selectedText);
            replaceSelectedText(activeElement, slugified);
          }
        }
      });
      console.log('rewrite-it: slugify menu command registered');
    } else {
      console.warn('rewrite-it: GM_registerMenuCommand not available');
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScript);
  } else {
    initializeScript();
  }
})();
