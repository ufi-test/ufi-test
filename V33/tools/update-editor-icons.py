"""Refresh static editor action icons from the same registry used by dynamic controls."""
from pathlib import Path
import json,re
r=Path(__file__).resolve().parents[1]
raw=(r/'article-builder/icons.js').read_text();icons=json.loads(raw.split('=',1)[1].strip().removesuffix(';'))
p=r/'article-builder/index.html';s=p.read_text()
rx=r'(<(?:button|summary|label)\b[^>]*data-icon="([^"]+)"[^>]*>)([\s\S]*?)(</(?:button|summary|label)>)'
def replace(m):
 opening,name,body,closing=m.groups()
 body=re.sub(r'<svg\b[^>]*class="action-icon"[\s\S]*?</svg>','',body).strip()
 return opening+'<svg class="action-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>'+body+closing
s=re.sub(rx,replace,s);p.write_text(s)
print('Updated static editor action icons.')
