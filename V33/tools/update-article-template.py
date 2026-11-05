"""Optional maintenance helper. Run after changing the shared article page shell."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
s=(root/'what-a-playtest-can-tell-you.html').read_text()
start=s.index(' <article ')
end=s.index('\n </article>',start)+len('\n </article>')
s=s[:start]+'<!--ARTICLE-->'+s[end:]
s=re.sub(r'<title>.*?</title>','<title><!--TITLE--> — UFi Research</title>',s)
s=re.sub(r'<meta name="description"[^>]+>','<meta name="description" content="<!--DESCRIPTION-->">',s)
s=s.replace('<script src="js/main.js" defer></script>','<script src="js/main.js" defer></script>\n<link rel="stylesheet" href="css/articles.css">')
example=json.loads((root/'article-builder/example-draft.json').read_text())
(root/'article-builder/template.js').write_text('/* Generated from the shared article shell. See MAINTENANCE.md. */\nwindow.UFI_ARTICLE_TEMPLATE = '+json.dumps(s)+';\nwindow.UFI_EXAMPLE_DRAFT = '+json.dumps(example)+';\n')
print('Updated article-builder/template.js')
