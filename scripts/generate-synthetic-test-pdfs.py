from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = Path("output/pdf")


DOCUMENTS = [
    {
        "filename": "MAT-001-meridian-components-facility-summary.pdf",
        "matter": "MAT-001 - Meridian Components - Secured Loan Recovery",
        "title": "Synthetic Facility Summary and Default Record",
        "type": "Facility agreement summary",
        "sections": [
            ("Purpose", "This synthetic document records the commercial and legal facts for testing MatterBridge extraction and normalization. It is not a real agreement and contains no real personal or financial information."),
            ("Parties", "Lender: Northstar Bank Ltd. Borrower: Meridian Components Pvt. Ltd. Guarantor: Meridian Holdings Pvt. Ltd. Jurisdiction: India."),
            ("Facility terms", "Facility amount: INR 48,000,000. Outstanding exposure: INR 31,750,000 as at 15 September 2026. Maturity date: 30 June 2025. Interest rate: 11.25% per annum."),
            ("Security", "The facility is secured by a first-ranking charge over identified receivables and inventory. The stated security value is INR 42,000,000, subject to confirmation by an updated search."),
            ("Default and recovery", "The borrower missed the instalment due on 31 March 2025. A demand notice was issued on 21 May 2025. Amount claimed in the notice: INR 32,460,000. Estimated recovery amount: INR 26,000,000."),
            ("Open item for review", "The priority of the receivables charge must be confirmed before enforcement proceeds. The document supports the existence of the charge but does not establish its final ranking against all competing interests."),
        ],
    },
    {
        "filename": "MAT-001-meridian-components-counsel-letter.pdf",
        "matter": "MAT-001 - Meridian Components - Secured Loan Recovery",
        "title": "Synthetic External Counsel Correspondence",
        "type": "External counsel letter",
        "sections": [
            ("To", "Northstar Bank Legal Department"),
            ("From", "Sethi Rao Legal - Recovery Practice"),
            ("Date", "18 September 2026"),
            ("Question referred", "Based on the facility documents and the default record, what is the optimal recovery pathway and is any further notice required before enforcement?"),
            ("Counsel advice", "On the assumptions reviewed, further contractual notice is not required before commencing the proposed enforcement step. We recommend confirming the priority of the receivables charge through an updated registry search before taking possession or issuing recovery instructions."),
            ("Advice limitations", "This is a synthetic response for testing. The conclusion depends on the registry search and any competing security interests not supplied with the brief."),
            ("Recommended follow-up", "Obtain the updated charge search, confirm the ranking, and return the result to counsel for a final enforcement confirmation."),
        ],
    },
    {
        "filename": "MAT-002-project-atlas-incident-record.pdf",
        "matter": "MAT-002 - Project Atlas - Employee Leave and Misconduct Review",
        "title": "Synthetic Employment Matter Incident Record",
        "type": "Employment investigation record",
        "sections": [
            ("Purpose", "This synthetic document is provided for testing the employment-matter normalization path. It is fictional and should not be treated as an actual HR record."),
            ("Employee and role", "Employee: Priya Nair. Role: Regional Operations Manager. Employment start date: 4 April 2022. Business unit: Operations."),
            ("Allegations", "The matter concerns alleged approval of leave records without supporting documentation and alleged failure to follow the expense approval policy during July and August 2026."),
            ("Known events", "The employee was notified of the investigation on 2 September 2026. An initial meeting occurred on 8 September 2026. The employee provided a written response on 12 September 2026."),
            ("Current facts", "The investigation notice was issued and the written response was received. The factual basis for the expense allegation remains partly disputed."),
            ("Open item for review", "Determine whether the evidence supports a formal disciplinary process or whether additional interviews are required before a decision is made."),
        ],
    },
    {
        "filename": "MAT-002-project-atlas-counsel-advice.pdf",
        "matter": "MAT-002 - Project Atlas - Employee Leave and Misconduct Review",
        "title": "Synthetic Employment Counsel Advice Note",
        "type": "External employment counsel advice",
        "sections": [
            ("To", "Atlas People and Legal Team"),
            ("From", "Iyer Employment Law - Advisory Team"),
            ("Date", "19 September 2026"),
            ("Question referred", "Can the company proceed to a disciplinary hearing on the current record, and what procedural safeguards should be followed?"),
            ("Counsel advice", "The current record supports continuing the investigation but is not yet sufficient to determine the allegation. Interview the approving manager and preserve the underlying leave and expense records before deciding whether to issue a disciplinary charge."),
            ("Procedural guidance", "Give the employee a reasonable opportunity to respond to any new material. Keep the investigation and any later disciplinary decision separately documented."),
            ("Recommended follow-up", "Complete two interviews, preserve the source records, and return the consolidated investigation pack for a further legal review."),
        ],
    },
    {
        "filename": "MAT-003-meridian-facility-original-disbursement.pdf",
        "matter": "MAT-003 - Meridian Facility - Original Disbursement",
        "title": "Synthetic Facility Origination Record",
        "type": "Historical facility record",
        "sections": [
            ("Purpose", "This synthetic document supports the historical Meridian Facility matter and tests cross-matter retrieval without changing the current recovery matter."),
            ("Origination", "The facility was approved on 15 July 2022 and disbursed on 22 July 2022. Original facility amount: INR 48,000,000. Borrower: Meridian Components Pvt. Ltd."),
            ("Security package", "The origination checklist records a proposed receivables charge and inventory charge. Registration evidence was marked for follow-up after disbursement."),
            ("Historical update", "The facility was later transferred into the recovery workflow after payment default. This document should be treated as historical source material, not as evidence of current enforcement status."),
            ("Open item for review", "Confirm whether the original registration evidence is the same security interest referenced in the current recovery matter."),
        ],
    },
    {
        "filename": "MAT-003-meridian-facility-registration-followup.pdf",
        "matter": "MAT-003 - Meridian Facility - Original Disbursement",
        "title": "Synthetic Registration Follow-up Note",
        "type": "Security registration correspondence",
        "sections": [
            ("From", "Northstar Bank Operations"),
            ("To", "Northstar Bank Legal Department"),
            ("Date", "4 August 2022"),
            ("Subject", "Registration evidence for Meridian Components security package"),
            ("Record", "The operations file contains a filing receipt for the receivables charge. The final registry extract was not included in the origination pack reviewed for this note."),
            ("Required follow-up", "Locate the final registry extract and confirm the registration date, ranking, and secured amount."),
            ("Testing note", "This synthetic document intentionally leaves a provenance gap so that the review workflow can distinguish a documented filing receipt from a verified current registry position."),
        ],
    },
]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawString(18 * mm, 9 * mm, "MATTERBRIDGE SYNTHETIC TEST DOCUMENT - NOT A REAL LEGAL RECORD")
    canvas.drawRightString(192 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build(document):
    path = OUTPUT / document["filename"]
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title=document["title"],
        author="MatterBridge synthetic test fixture generator",
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle("Title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=22, leading=28, textColor=colors.HexColor("#172554"), alignment=TA_CENTER, spaceAfter=8)
    subtitle = ParagraphStyle("Subtitle", parent=styles["Normal"], fontSize=10, leading=15, textColor=colors.HexColor("#475569"), alignment=TA_CENTER, spaceAfter=18)
    heading = ParagraphStyle("Heading", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=colors.HexColor("#1E3A8A"), spaceBefore=8, spaceAfter=5)
    body = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=10.5, leading=16, textColor=colors.HexColor("#1E293B"), spaceAfter=8)
    label = ParagraphStyle("Label", parent=body, fontName="Helvetica-Bold", textColor=colors.HexColor("#475569"), spaceAfter=3)
    story = [Paragraph(document["title"], title), Paragraph(document["matter"], subtitle)]
    metadata = Table([[Paragraph("Matter ID", label), Paragraph(document["matter"].split(" - ", 1)[0], body)], [Paragraph("Document type", label), Paragraph(document["type"], body)], [Paragraph("Status", label), Paragraph("Synthetic test fixture - upload and review", body)]], colWidths=[35 * mm, 135 * mm])
    metadata.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EFF6FF")), ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")), ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#E2E8F0")), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    story.extend([metadata, Spacer(1, 12)])
    for section_title, section_text in document["sections"]:
        story.extend([Paragraph(section_title, heading), Paragraph(section_text, body)])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    return path


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for document in DOCUMENTS:
        print(build(document))


if __name__ == "__main__":
    main()
