from pathlib import Path
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Juan_Osega_PFY2201_Evidencias_Semana8.md'
OUTPUT = SOURCE.with_suffix('.pdf')
NORMAL = 'Helvetica'
BOLD = 'Helvetica-Bold'
FONT_DIRECTORY = Path('C:/Windows/Fonts')
if (FONT_DIRECTORY / 'segoeui.ttf').exists():
    pdfmetrics.registerFont(TTFont('Informe', str(FONT_DIRECTORY / 'segoeui.ttf')))
    pdfmetrics.registerFont(TTFont('InformeBold', str(FONT_DIRECTORY / 'segoeuib.ttf')))
    pdfmetrics.registerFontFamily('Informe', normal='Informe', bold='InformeBold')
    NORMAL, BOLD = 'Informe', 'InformeBold'

styles = getSampleStyleSheet()
styles.add(ParagraphStyle('Texto', fontName=NORMAL, fontSize=10, leading=15, spaceAfter=8, textColor=colors.HexColor('#334155')))
styles.add(ParagraphStyle('Titulo', fontName=BOLD, fontSize=24, leading=30, spaceAfter=18, textColor=colors.HexColor('#0f172a')))
styles.add(ParagraphStyle('Subtitulo', fontName=BOLD, fontSize=14, leading=19, spaceBefore=8, spaceAfter=9, textColor=colors.HexColor('#0369a1')))
styles.add(ParagraphStyle('Apartado', fontName=BOLD, fontSize=11, leading=16, spaceBefore=8, spaceAfter=5, textColor=colors.HexColor('#0f172a')))
styles.add(ParagraphStyle('Lista', parent=styles['Texto'], leftIndent=12, firstLineIndent=-10, spaceAfter=5))
styles.add(ParagraphStyle('PieImagen', parent=styles['Texto'], fontSize=8, leading=12, alignment=TA_CENTER, textColor=colors.HexColor('#64748b')))


def inline(text):
    text = escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'`([^`]+)`', r'<font color="#0369a1">\1</font>', text)
    return text


def decorate(canvas, document):
    width, height = document.pagesize
    canvas.saveState()
    canvas.setFillColor(colors.HexColor('#080a12'))
    canvas.rect(0, height - 52, width, 52, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor('#38bdf8'))
    canvas.setFont(BOLD, 12)
    canvas.drawString(42, height - 32, 'Pixel Store')
    canvas.setFillColor(colors.white)
    canvas.setFont(NORMAL, 9)
    canvas.drawRightString(width - 42, height - 32, 'Evidencias · Semana 8')
    canvas.setStrokeColor(colors.HexColor('#cbd5e1'))
    canvas.line(42, 37, width - 42, 37)
    canvas.setFillColor(colors.HexColor('#64748b'))
    canvas.setFont(NORMAL, 8)
    canvas.drawString(42, 24, 'Juan Carlos Osega · PFY2201')
    canvas.drawRightString(width - 42, 24, str(document.page))
    canvas.restoreState()


def build():
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=(595.28, 841.89), leftMargin=42, rightMargin=42,
        topMargin=76, bottomMargin=52, title='Evidencias Semana 8 · Pixel Store',
        author='Juan Carlos Osega'
    )
    story = []
    paragraphs = SOURCE.read_text(encoding='utf-8').split('\n\n')
    for block in paragraphs:
        block = block.strip()
        if not block:
            continue
        if block == '---':
            story.append(PageBreak())
        elif block.startswith('!['):
            match = re.fullmatch(r'!\[(.+?)\]\((.+?)\)', block)
            if not match:
                raise ValueError('Referencia de imagen inválida')
            label, relative = match.groups()
            path = ROOT / relative
            image_width, image_height = ImageReader(str(path)).getSize()
            scale = min(document.width / image_width, 400 / image_height)
            story.append(Image(str(path), width=image_width * scale, height=image_height * scale))
            story.append(Spacer(1, 8))
            story.append(Paragraph(inline(label), styles['PieImagen']))
            story.append(Spacer(1, 12))
        elif block.startswith('# '):
            story.append(Paragraph(inline(block[2:]), styles['Titulo']))
        elif block.startswith('## '):
            story.append(Paragraph(inline(block[3:]), styles['Subtitulo']))
        elif block.startswith('### '):
            story.append(Paragraph(inline(block[4:]), styles['Apartado']))
        elif block.startswith('- ') or re.match(r'^\d+\. ', block):
            for line in block.splitlines():
                text = '• ' + line[2:] if line.startswith('- ') else line
                story.append(Paragraph(inline(text), styles['Lista']))
        else:
            story.append(Paragraph(inline(' '.join(block.splitlines())), styles['Texto']))
    document.build(story, onFirstPage=decorate, onLaterPages=decorate)
    print(f'PDF generado: {OUTPUT}')


if __name__ == '__main__':
    build()
