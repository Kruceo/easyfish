import jsPDF from "jspdf"
import beautyNumber from "../../../../constants/numberUtils"

interface PdfItemBoundings {
    x: number,
    y: number,
    w: number,
    h: number,
    x2: number,
    y2: number,
    centerX: number
}

export function writeTable(pdf: jsPDF, data: (string | number)[][], startX: number, startY: number, header: string[], dispositionOfData?: number[], dispositionOfStyle?: string[]): PdfItemBoundings {

    const sX = startX
    const sY = startY

    const disposition = (data[0] ?? header).map((_, index) => dispositionOfData ? (dispositionOfData[index] ?? 1) : 1)
    const dispositionSum = disposition.reduce((acum, next) => acum + next, 0)

    const fullW = pdf.internal.pageSize.width
    const fullH = pdf.internal.pageSize.height
    const rowH = 7
    const cellFraction = (fullW - startX * 2) / dispositionSum

    const dataWithHeader = [[...header], ...data]
    const sumH = dataWithHeader.length * rowH

    //this is used for sub the page height in case of various pages
    let subtract = 0
    dataWithHeader.forEach((row, rowIndex) => {
       
        let y = (subtract ? 0 : sY) + (rowIndex * rowH) - subtract
       

        if (y + rowH * 2 > fullH) {
            pdf.addPage()
            pdf.setPage(pdf.internal.pages.length)
            subtract = rowIndex * rowH - rowH
            y = (subtract ? 0 : sY) + (rowIndex * rowH) - subtract
        }

        let colXSum = 0
        row.forEach((column, columnIndex) => {

            const cellW = cellFraction * disposition[columnIndex]
            if (typeof (column) == 'number') column = beautyNumber(column)
            if (column == "-") { colXSum += cellW; return; }

            //Case is first index , is HEADER
            if (rowIndex == 0) {
                pdf.setFont(pdf.getFont().fontName, "bold")
                pdf.setLineWidth(0.75)
            }
            else {
                pdf.setFont(pdf.getFont().fontName, "normal")
                pdf.setLineWidth(0.25)
            }

            if (dispositionOfStyle) {
                if (dispositionOfStyle[columnIndex] == 'bold') {
                    pdf.setFont(pdf.getFont().fontName, 'bold')
                    pdf.setLineWidth(0.75)
                }
            }

            const x = sX + colXSum
            const box = writeBox(pdf, x, y, cellW, rowH)

            let align: "left" | "right" | "center" = 'center'
            let textX = box.centerX

            //Case is number
            if (/^(\d|,|\.|-)+$/.test(column)) {
                align = "right"
                textX = box.x2 - 1
            }
            //Case is string and is not a header (first row index)
            else if (rowIndex != 0) {
                align = "left"
                textX = box.x + 1
            }

            colXSum += cellW
            pdf.text(column, textX, box.y2 - box.h / 4, { align: align })
        })

    })
    return { x: sX, y: sY, w: fullW, h: sumH, x2: sX + fullW, y2: (subtract?0:sY) + sumH - subtract, centerX: fullW / 2 }
}

export function writeBox(pdf: jsPDF, x: number, y: number, w: number, h: number): PdfItemBoundings {
    pdf.rect(x, y, w, h)
    return { x, y, w, h, x2: w + x, y2: h + y, centerX: x + w / 2 }
}

export function writeHeader(pdf: jsPDF, identification: string, date1: Date, date2: Date): PdfItemBoundings {
    const startY = 5
    const startX = 5
    const height = 15
    const pageW = pdf.internal.pageSize.width
    // const pageH = pdf.internal.pageSize.height

    pdf.setLineWidth(0.75);
    const headerBox = writeBox(pdf, startX, startY, pageW - 10, height)
    // const dateBox = writeBox(pdf, headerBox.x2, headerBox.y, 35, headerBox.h)

    pdf.setFontSize(16)
    pdf.setFont(pdf.getFont().fontName, "", "bold")
    pdf.text("CONTROLE DE ENTRADA DE CAMARÃO/ARTESANAL", headerBox.centerX, 12, { align: 'center' })

    pdf.setFont(pdf.getFont().fontName, "", "normal")
    pdf.setFontSize(12)
    pdf.text(`${date1.toLocaleDateString()} ATÉ ${date2.toLocaleDateString()}`, headerBox.centerX, 18, { align: "center" })

    pdf.setFont(pdf.getFont().fontName, "", "bold")
    pdf.setFontSize(6)
    pdf.text(`${identification}`, headerBox.x2 - 2, headerBox.y2 - 2, { align: "right" })

    const totalW = headerBox.w
    // + dateBox.w

    return { x: startX, y: startY, h: height, w: totalW, x2: startX + totalW, y2: startY + height, centerX: startX + totalW / 2 }
}

export function openPDF(pdf: jsPDF) {
    const dadosDoPDF = pdf.output('dataurlstring');

    // Cria uma nova janela ou guia do navegador e abre o PDF
    const novaJanela = window.open();
    if (novaJanela)
        novaJanela.document.write('<iframe width="100%" height="100%" src="' + dadosDoPDF + '"></iframe>');
}